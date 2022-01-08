import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  hash() {
    return Promise.resolve('hash')
  }
}))

const makeSut = () => {
  const salt = 12
  const sut = new BcryptAdapter(salt)

  return { sut }
}

describe('BcryptAdapter', () => {
  test('Should call bcrypt with correct value', () => {
    const { sut } = makeSut()
    const bcryptSpy = jest.spyOn(bcrypt, 'hash')
    sut.encrypt('any_value')
    expect(bcryptSpy).toBeCalledWith('any_value', 12)
  });

  test('Should return a hash on success', async () => {
    const { sut } = makeSut()
    const result = await sut.encrypt('any_value')
    expect(result).toBe('hash')
  });

  test('Should throw if bcrypt throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.encrypt('any_value')
    await expect(promise).rejects.toThrow()
  });
});