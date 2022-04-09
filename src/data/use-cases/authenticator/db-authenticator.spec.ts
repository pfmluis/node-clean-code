import { AccountModel } from '../../../domain/models/account'
import { AuthenticationModel } from '../../../domain/use-cases/authenticator'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email'
import { DbAuthenticator } from './db-authenticator'

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

const makeSut = () => {
  const loadAccountByEmail = makeAccountByEmailRepositoryStub()
  const sut = new DbAuthenticator(loadAccountByEmail)
  
  return {
    sut,
    loadAccountByEmail,
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmail with correct email', async () => {
    const { sut, loadAccountByEmail } = makeSut()
    const loadAccountByEmailSpy = jest.spyOn(loadAccountByEmail, 'load')
    const auth: AuthenticationModel = {
      email: 'some_valid@email.com',
      password: 'some_password',
    }

    await sut.authenticate(auth)
    expect(loadAccountByEmailSpy).toHaveBeenCalledWith(auth.email)
  })
})