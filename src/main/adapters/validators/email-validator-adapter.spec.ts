import { EmailValidatorAdapter } from './email-validator-adapter';
import validator from 'validator';

const sut = new EmailValidatorAdapter()

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  }
}))

describe('EmailValidatedAdapter', () => {
  test('Should return false if validator returns false', () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  });

  test('Should return true if validator returns true', () => {
    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBe(true)
  });

  test('Should call validator with correct values', () => {
    const validatorSpy = jest.spyOn(validator, 'isEmail')
    const validEmail = 'valid_email@mail.com'
    sut.isValid(validEmail)
    expect(validatorSpy).toHaveBeenCalledWith(validEmail)
  });
})