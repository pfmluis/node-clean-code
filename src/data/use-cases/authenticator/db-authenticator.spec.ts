import { AccountModel } from '../../../domain/models/account'
import { AuthenticationModel, Authenticator } from '../../../domain/use-cases/authenticator'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email'
import { DbAuthenticator } from './db-authenticator'

interface SutTypes {
  sut: Authenticator
  loadAccountByEmailStub: LoadAccountByEmailRepository,
  hashComparerStub: HashComparer
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

const makeHashCompare = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return true
    }
  }

  return new HashComparerStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailStub = makeAccountByEmailRepositoryStub()
  const hashComparerStub = makeHashCompare()
  const sut = new DbAuthenticator(loadAccountByEmailStub, hashComparerStub)
  
  return {
    sut,
    loadAccountByEmailStub,
    hashComparerStub,
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

  test('Should call HashCompare with correct password', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    const auth: AuthenticationModel = {
      email: 'some_valid@email.com',
      password: 'some_password',
    }

    await sut.authenticate(auth)
    expect(compareSpy).toBeCalledWith(auth.password, 'password')
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValue(Promise.reject(new Error()))
    const auth: AuthenticationModel = {
      email: 'some_valid@email.com',
      password: 'some_password',
    }

    const promise = sut.authenticate(auth)
    expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValue(false)
    const auth: AuthenticationModel = {
      email: 'some_valid@email.com',
      password: 'some_password',
    }

    const result = await sut.authenticate(auth)
    expect(result).toBe(null)
  })
})