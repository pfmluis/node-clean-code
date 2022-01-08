import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter';

describe('BcryptAdapter', () => {
  test('Should call bcrypt with correct value', () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const bcryptSpy = jest.spyOn(bcrypt, 'hash')
    sut.encrypt('any_value')
    expect(bcryptSpy).toBeCalledWith('any_value', 12)
  });
});