import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden, ok, serverError } from '../helpers/http/http-helpers'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from '../../domain/use-cases/load-account-by-token'
import { AccountModel } from '../../domain/models/account';
import { HttpRequest } from '../protocols/http-request';

type SutTypes = {
  loadAccountByTokenStub: LoadAccountByToken,
  sut: AuthMiddleware
}

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'some_id',
  email: 'some@email.com',
  name: 'some_name',
  password: 'some_password'
})

const makeLoadAccountByTokenStub = () => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    load(token: string, role?: string | undefined): Promise<AccountModel | null> {
      return Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadAccountByTokenStub()
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)

  return {
     loadAccountByTokenStub,
     sut,
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError))
  });

  test('Should call LoadAccountByToken with correct access token', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadAccountByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(makeFakeRequest())

    expect(loadAccountByTokenSpy).toHaveBeenCalledWith('any_token', role)
  })

  test('Should return 403 when LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError))
  })


  test('Should return 200 when LoadAccountByToken returns Account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok({ accountId: 'some_id' }))
  })

  test('Should return 500 when LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(Promise.reject(new Error('some_error')))
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error('some_error')))
  })
});