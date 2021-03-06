import { InvalidParamError } from '../../errors/invalid-param-error';
import { EmailValidator } from '../../protocols/email-validator';
import { EmailFieldValidator } from './email-validator';

interface SutType {
  sut: EmailFieldValidator,
  emailValidatorStub: EmailValidator,
}

const makeEmailValidator = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}



const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailFieldValidator('email', emailValidatorStub)

  return {
    sut,
    emailValidatorStub,
  }
}

describe('Email Field Validator', () => {
  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const input = {
      email: 'invalid_email_@.com',
    }
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.validate(input)
    expect(isValidSpy).toHaveBeenCalledWith(input.email)
  });

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const input = {
      email: 'invalid_email_@.com',
    }
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(
      (email: string) => {
        throw new Error()
      }
    )

    expect(sut.validate).toThrow()
  });

  test('Should return InvalidFieldError if email is not valid', () => {
    const { sut, emailValidatorStub } = makeSut()
    const input = { email: 'some_invalid_email@emial.com' }
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const result = sut.validate(input)
    expect(result).toEqual(new InvalidParamError('email'))
  })

  test('Should return null if two fields match', () => {
    const { sut } = makeSut()
    const input = { email: 'some_email@emial.com' }

    const result = sut.validate(input)
    expect(result).toBe(null)
  })
})