import { AccountModel } from '../../../domain/models/account';
import { AddAccountModel } from '../../../domain/use-cases/add-account';
import { Hasher } from '../../protocols/cryptography/hasher';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { DbAddAccount } from './db-add-account';

class EncryptorStub implements Hasher {
  hash(value: string): Promise<string> {
    return Promise.resolve('encrypted_value')
  }
}

class AddAccountRepositoryStub {
  add (account: AddAccountModel): Promise<AccountModel> {
    return Promise.resolve({
      ...account, 
      id: 'valid_id'
    })
  }
}

class AccountByEmailStub implements LoadAccountByEmailRepository {
  async loadByEmail(email: string): Promise<AccountModel> {
    return null as any;
  }
}

const makeSut = () => {
  const encryptorStub = new EncryptorStub()
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  const loadAccountByEmailStub = new AccountByEmailStub()
  const sut = new DbAddAccount(encryptorStub, addAccountRepositoryStub, loadAccountByEmailStub)

  return {
    loadAccountByEmailStub,
    addAccountRepositoryStub,
    encryptorStub,
    sut
  }
}

describe('DbAddAccount', () => {
  test('Should call Hasher with correct password', async () => {
    const { encryptorStub, sut } = makeSut()
    const encryptorSpy = jest.spyOn(encryptorStub, 'hash')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'validPassword'
    }
    await sut.add(accountData)
    expect(encryptorSpy).toHaveBeenCalledWith(accountData.password)
  });

  test('Should throw if Hasher throws', async () => {
    const { encryptorStub, sut } = makeSut()
    jest.spyOn(encryptorStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'validPassword'
    }
    const result = sut.add(accountData)
    await expect(result).rejects.toThrow()
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'validPassword'
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'encrypted_value'
    })
  });

  test('Should throw if repository throws', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'validPassword'
    }
    const result = sut.add(accountData)
    await expect(result).rejects.toThrow()
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'validPassword'
    }
    const result = await sut.add(accountData)
    expect(result).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'encrypted_value'
    })
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'validPassword'
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'encrypted_value'
    })
  });

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailStub } = makeSut()
    const loadAccountByEmailSpy = jest.spyOn(loadAccountByEmailStub, 'loadByEmail')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'validPassword'
    }

    await sut.add(accountData)
    expect(loadAccountByEmailSpy).toHaveBeenCalledWith(accountData.email)
  })

  test('Should return null when LoadAccountByEmailRepository finds an account with the given email', async () => {
    const { sut, loadAccountByEmailStub } = makeSut()
    const loadAccountByEmailAccount: AccountModel = {
      id: 'valid_id',
      email: 'valid_email@mail.com',
      name: 'valid_name',
      password: 'secret_password'
    }
    jest.spyOn(loadAccountByEmailStub, 'loadByEmail').mockImplementationOnce(() => Promise.resolve(loadAccountByEmailAccount))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'validPassword'
    }

    const result = await sut.add(accountData)
    expect(result).toBe(null)
  })
});