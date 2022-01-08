import { AccountModel } from '../../../domain/models/account';
import { AddAccountModel } from '../../../domain/use-cases/add-account';
import { Encryptor } from '../../protocols/encryptor';
import { DbAddAccount } from './db-add-account';

class EncryptorStub implements Encryptor {
  encrypt(value: string): Promise<string> {
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

const makeSut = () => {
  const encryptorStub = new EncryptorStub()
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  const sut = new DbAddAccount(encryptorStub, addAccountRepositoryStub)

  return {
    addAccountRepositoryStub,
    encryptorStub,
    sut
  }
}

describe('DbAddAccount', () => {
  test('Should call Encryptor with correct password', async () => {
    const { encryptorStub, sut } = makeSut()
    const encryptorSpy = jest.spyOn(encryptorStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'validPassword'
    }
    await sut.add(accountData)
    expect(encryptorSpy).toHaveBeenCalledWith(accountData.password)
  });

  test('Should throw if encryptor throws', async () => {
    const { encryptorStub, sut } = makeSut()
    jest.spyOn(encryptorStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))
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
});