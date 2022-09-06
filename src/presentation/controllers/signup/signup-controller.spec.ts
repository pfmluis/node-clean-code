import { AccountModel } from "../../../domain/models/account";
import { AddAccount, AddAccountModel } from "../../../domain/use-cases/add-account";
import { AuthenticationModel, Authenticator } from '../../../domain/use-cases/authenticator';
import { MissingParamError } from "../../errors/missing-param-error";
import { ServerError } from "../../errors/server-error";
import { badRequest, serverError } from '../../helpers/http/http-helpers';
import { Validator } from '../../protocols/validator';
import { SignUpController } from "./signup-controller";

interface SutTypes {
  sut: SignUpController
  authenticatorStub: Authenticator
  addAccountStub: AddAccount
  validatorStub: Validator
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
      return null as any
    }
  }

  return new ValidatorStub()
}

const makeAuthenticator = (): Authenticator => {
  class AuthenticatorStub implements Authenticator {
    async authenticate(auth: AuthenticationModel): Promise<string> {
      return 'valid_token'
    }
  }

  return new AuthenticatorStub()
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validatorStub = makeValidator()
  const authenticatorStub = makeAuthenticator()
  const sut = new SignUpController(addAccountStub, validatorStub, authenticatorStub)

  return {
    sut,
    authenticatorStub,
    addAccountStub,
    validatorStub,
  }
}

describe('SignUp Controller', () => {
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

  test('Should return 400 if email already exists', async () => {
    const { sut, addAccountStub } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => Promise.resolve(null))

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Email already exists'))
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
    expect(httpResponse.body).toEqual({ accessToken: 'valid_token' })
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

  test('Should return 400 if valid returns an error', async () => {
    const { sut, validatorStub } = makeSut()
    const error = new MissingParamError('some error')
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(error)

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(error))
  });

  test('Should call Authenticator with correct values', async () => {
    const { sut, authenticatorStub } = makeSut()
    const authenticatorSpy = jest.spyOn(authenticatorStub, 'authenticate')
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(authenticatorSpy).toHaveBeenCalledWith({
      email: httpRequest.body.email, 
      password: httpRequest.body.password,
    })

  })

  test('Should call 500 if authenticator throws', async () => {
    const { sut, authenticatorStub } = makeSut()
    const error = new Error()
    jest.spyOn(authenticatorStub, 'authenticate').mockImplementationOnce(() => { throw error })
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'any_password'
      }
    }
    
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(serverError(error))
  })  
})