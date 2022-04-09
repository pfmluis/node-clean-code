import { AccountModel } from '../../../domain/models/account'
import { AuthenticationModel, Authenticator } from '../../../domain/use-cases/authenticator'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { TokenGenerator } from '../../protocols/cryptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'
import { DbAuthenticator } from './db-authenticator'

interface SutTypes {
  sut: Authenticator
  loadAccountByEmailStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator,
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
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

const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return 'some_token'
    }
  }

  return new TokenGeneratorStub()
}

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update(id: string, token: string): Promise<void> {
      return Promise.resolve()
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailStub = makeAccountByEmailRepositoryStub()
  const hashComparerStub = makeHashCompare()
  const tokenGeneratorStub = makeTokenGeneratorStub()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()
  const sut = new DbAuthenticator(loadAccountByEmailStub, hashComparerStub, tokenGeneratorStub, updateAccessTokenRepositoryStub)
  
  return {
    sut,
    loadAccountByEmailStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
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


  test('Should call TokenGenerator with correct password', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    const auth: AuthenticationModel = {
      email: 'some_valid@email.com',
      password: 'some_password',
    }

    await sut.authenticate(auth)
    expect(generateSpy).toBeCalledWith('some_id')
  })

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValue(Promise.reject(new Error()))
    const auth: AuthenticationModel = {
      email: 'some_valid@email.com',
      password: 'some_password',
    }

    const promise = sut.authenticate(auth)
    expect(promise).rejects.toThrow()
  })

  test('Should return correct token', async () => {
    const { sut } = makeSut()
    const auth: AuthenticationModel = {
      email: 'some_valid@email.com',
      password: 'some_password',
    }

    const token = await sut.authenticate(auth)
    expect(token).toBe('some_token')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateRepoSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    const auth: AuthenticationModel = {
      email: 'some_valid@email.com',
      password: 'some_password',
    }

    await sut.authenticate(auth)
    expect(updateRepoSpy).toBeCalledWith('some_id', 'some_token')
  })


  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockReturnValue(Promise.reject(new Error()))
    const auth: AuthenticationModel = {
      email: 'some_valid@email.com',
      password: 'some_password',
    }

    const promise = sut.authenticate(auth)
    expect(promise).rejects.toThrow()
  })

})