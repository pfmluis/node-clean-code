import { Authenticator } from '../../../domain/use-cases/authenticator'
import { MissingParamError } from '../../errors/missing-param-error'
import { badRequest, serverError, unauthorized, ok } from '../../helpers/http-helpers'
import { Validator } from '../../helpers/validators/validator'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController,
  validatorStub: Validator,
  authenticatorStub: Authenticator,
}

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate(input: any): Error {
      return null
    }
  }
  

  return new ValidatorStub()
}

const makeAuthenticator = (): Authenticator => {
  class AuthenticatorStub implements Authenticator {
    async authenticate(email: string, password: string): Promise<string> {
      return 'valid_token'
    }
  }

  return new AuthenticatorStub()
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidator()
  const authenticatorStub = makeAuthenticator()
  const sut = new LoginController(validatorStub, authenticatorStub)

  return {
    sut,
    validatorStub,
    authenticatorStub,
  }
}

describe('Login Controller', () => {
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
    expect(authenticatorSpy).toHaveBeenCalledWith(
      httpRequest.body.email, 
      httpRequest.body.password,
    )
  })

  test('Should call 401 if invalid credentials are provided', async () => {
    const { sut, authenticatorStub } = makeSut()
    jest.spyOn(authenticatorStub, 'authenticate').mockImplementationOnce(() => Promise.resolve(null))
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'any_password'
      }
    }
    
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(unauthorized())
  })


  test('Should call 500 if invalid credentials are provided', async () => {
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


  test('Should call 200 if invalid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'any_password'
      }
    }
    
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(ok({ accessToken: 'valid_token' }))
  })
})