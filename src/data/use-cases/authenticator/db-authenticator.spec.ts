import { AccountModel } from '../../../domain/models/account'
import { AuthenticationModel } from '../../../domain/use-cases/authenticator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email'
import { DbAuthenticator } from './db-authenticator'

interface SutTypes {
  sut: DbAuthenticator
  loadAccountByEmailStub: LoadAccountByEmailRepository
}

const makeAccountByEmailRepositoryStub = () => {
  class AccountByEmailStub implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel> {
      return {
        id: 'some_id',
        email: 'some_email@email.com',
        password: 'password',
        name: 'some_name',
      }
    }
  }

  return new AccountByEmailStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailStub = makeAccountByEmailRepositoryStub()
  const sut = new DbAuthenticator(loadAccountByEmailStub)
  
  return {
    sut,
    loadAccountByEmailStub,
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailStub } = makeSut()
    const loadAccountByEmailSpy = jest.spyOn(loadAccountByEmailStub, 'load')
    const auth: AuthenticationModel = {
      email: 'some_valid@email.com',
      password: 'some_password',
    }

    await sut.authenticate(auth)
    expect(loadAccountByEmailSpy).toHaveBeenCalledWith(auth.email)
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailStub } = makeSut()
    jest.spyOn(loadAccountByEmailStub, 'load').mockReturnValue(Promise.reject(new Error()))
    const auth: AuthenticationModel = {
      email: 'some_valid@email.com',
      password: 'some_password',
    }

    const promise = sut.authenticate(auth)
    expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailStub } = makeSut()
    jest.spyOn(loadAccountByEmailStub, 'load').mockResolvedValueOnce(null)
    const auth: AuthenticationModel = {
      email: 'some_valid@email.com',
      password: 'some_password',
    }

    const accessToken = await sut.authenticate(auth)
    expect(accessToken).toBe(null)
  })
})