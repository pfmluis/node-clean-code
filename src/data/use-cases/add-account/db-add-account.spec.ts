import { Encryptor } from '../../protocols/encryptor';
import { DbAddAccount } from './db-add-account';

class EncryptorStub implements Encryptor {
  encrypt(value: string): Promise<string> {
    return Promise.resolve('encrypted_value')
  }
}

const makeSut = () => {
  const encryptorStub = new EncryptorStub()
  const sut = new DbAddAccount(encryptorStub)

  return {
    encryptorStub,
    sut
  }
}

describe('DbAddAccount', () => {
  test('Should call Encryptor with correct password', async () => {
    const { encryptorStub, sut } = makeSut()
    const encryptorSpy = jest.spyOn(encryptorStub, 'encrypt')
    const accountData = {
      name: 'Valid Name',
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
      name: 'Valid Name',
      email: 'valid_email@mail.com',
      password: 'validPassword'
    }
    const result = sut.add(accountData)
    await expect(result).rejects.toThrow()
  });
});