import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { MissingParamError } from '../../errors/missing-param-error'
import { badRequest, serverError } from '../../helpers/http-helpers'
import { EmailValidator } from '../../protocols/email-validator'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController,
  emailValidator: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidator = new EmailValidatorAdapter()
  const sut = new LoginController(emailValidator)

  return {
    sut,
    emailValidator,
  }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email is not defined')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password is not defined')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidator } = makeSut()
    const spyEmailValidator = jest.spyOn(emailValidator, 'isValid')
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(spyEmailValidator).toHaveBeenCalledWith(httpRequest.body.email)
  })


  test('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidator } = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email is not valid')))
  })

  test('Should return 500 if email validator throws', async () => {
    const { sut, emailValidator } = makeSut()
    const error = new Error()
    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => { throw error })
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(error))
  })
})