import bcrypt, { compare } from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  hash() {
    return Promise.resolve('hash')
  },
  compare() {
    return Promise.resolve(true)
  }
}))

const makeSut = () => {
  const salt = 12
  const sut = new BcryptAdapter(salt)

  return { sut }
}

describe('BcryptAdapter', () => {
  test('Should call bcrypt.hash with correct value', () => {
    const { sut } = makeSut()
    const bcryptSpy = jest.spyOn(bcrypt, 'hash')
    sut.hash('any_value')
    expect(bcryptSpy).toBeCalledWith('any_value', 12)
  });

  test('Should return a bcrypt.hash on success', async () => {
    const { sut } = makeSut()
    const result = await sut.hash('any_value')
    expect(result).toBe('hash')
  });

  test('Should throw if bcrypt.hash throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  });

  test('Should call bcrypt.compare with correct value', () => {
    const { sut } = makeSut()
    const bcryptSpy = jest.spyOn(bcrypt, 'compare')
    sut.compare('any_value', 'hash')
    expect(bcryptSpy).toBeCalledWith('any_value', 'hash')
  });

  test('Should return a bcrypt.compare on success', async () => {
    const { sut } = makeSut()
    const result = await sut.compare('any_value', 'hash')
    expect(result).toBe(true)
  });

  test('Should throw if bcrypt.compare throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.compare('any_value', 'hash')
    await expect(promise).rejects.toThrow()
  });

});