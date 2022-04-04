import { AccountModel } from "../../../domain/models/account";
import { AddAccount, AddAccountModel } from "../../../domain/use-cases/add-account";
import { InvalidParamError } from "../../errors/invalid-param-error";
import { MissingParamError } from "../../errors/missing-param-error";
import { ServerError } from "../../errors/server-error";
import { Validator } from '../../helpers/validators/validator';
import { EmailValidator } from "../../protocols/email-validator";
import { SignUpController } from "./signup";

interface SutTypes {
  sut: SignUpController,
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
  validatorStub: Validator
}

const makeEmailValidator = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = () => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve({
        id: 'valid_id',
        ...account
      })
    }
  }

  return new AddAccountStub()
}

const makeValidator = () => {
  class ValidatorStub implements Validator {
    validate(input: any): Error {
      return null
    }
  }

  return new ValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const validatorStub = makeValidator()
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validatorStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validatorStub,
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  });

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  });

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  });

  test('Should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  });

  test('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  });

  test('Should return 400 if email is invalid', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email_@.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  });

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email_@.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  });

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email_@.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(
      (email: string) => {
        throw new Error()
      }
    )
    

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  });

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const addAccountSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(httpRequest)
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
  });

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, addAccountStub } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email_@.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(
      (account: AddAccountModel) => {
        return Promise.reject(new Error())
      }
    )
    

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      email: 'any_email@mail.com',
      name: 'any_name',
      password: 'any_password',
    })
  });

  test('Should call Validator with correct value', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  });
})