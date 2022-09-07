import { AuthenticationModel, Authenticator } from '../../../../domain/use-cases/authenticator'
import { badRequest, serverError, unauthorized, ok } from '../../../helpers/http/http-helpers'
import { Validator } from '../../../protocols/validator'
import { LoginController } from './login-controller'

interface SutTypes {
  sut: LoginController,
  validatorStub: Validator,
  authenticatorStub: Authenticator,
}

const makeValidator = (): Validator => {
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
    expect(authenticatorSpy).toHaveBeenCalledWith({
      email: httpRequest.body.email, 
      password: httpRequest.body.password,
    })
  })

  test('Should call 401 if invalid credentials are provided', async () => {
    const { sut, authenticatorStub } = makeSut()
    jest.spyOn(authenticatorStub, 'authenticate').mockImplementationOnce(() => Promise.resolve(null as any))
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'any_password'
      }
    }
    
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(unauthorized())
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