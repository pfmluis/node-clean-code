import { AccountModel } from '../../../domain/models/account'
import { Decryptor } from '../../protocols/cryptography/decryptor'
import { LoadAccountByTokenRepository } from '../../protocols/db/load-account-by-token-repository'
import { DbLoadAccountByToken } from './db-load-account-by-token'

type SutTypes = {
  decryptorStub: Decryptor
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
  sut: DbLoadAccountByToken
}

const makeFakeAccount = (): AccountModel => ({
  id: 'some_id',
  email: 'some@email.com',
  name: 'some_name',
  password: 'some_password'
})

const makeDecryptorStub = () => {
  class DecrypterSutb implements Decryptor {
    public async decrypt(encodedValue: string): Promise<string | null> {
      return 'any_string'
    }
  }

  return new DecrypterSutb()
}

const makeLoadAccountByTokenRepositoryStub = () => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    public async loadByToken(token: string): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }

  return new LoadAccountByTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const decryptorStub = makeDecryptorStub()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepositoryStub()
  const sut = new DbLoadAccountByToken(decryptorStub, loadAccountByTokenRepositoryStub)

  return {
    sut,
    decryptorStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken Use Case', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decryptorStub } = makeSut()
    const decryptorSpy = jest.spyOn(decryptorStub, 'decrypt')

    await sut.load('test_string')
    expect(decryptorSpy).toHaveBeenCalledWith('test_string')
  });

  test('Should return null if Decryptor returns null', async () => {
    const { sut, decryptorStub } = makeSut()
    jest.spyOn(decryptorStub, 'decrypt').mockResolvedValueOnce(null)

    const result = await sut.load('test_string')
    expect(result).toBe(null)
  });

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const LoadAccountByTokenRepositorySpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')

    await sut.load('test_string', 'some_role')
    expect(LoadAccountByTokenRepositorySpy).toHaveBeenCalledWith('test_string', 'some_role')
  });
});