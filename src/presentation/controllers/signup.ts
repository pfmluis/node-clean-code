import { InvalidParamError } from "../errors/invalid-param-error"
import { MissingParamError } from "../errors/missing-param-error"
import { badRequest, serverError } from "../helpers/http-helpers"
import { EmailValidator } from "../protocols/email-validator"
import { HttpRequest } from "../protocols/http-request"
import { HttpResponse } from "../protocols/http-response"

export class SignUpController {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  public handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const fieldNames = ['name', 'email', 'password', 'passwordConfirmation']
      for (const fieldName of fieldNames) {
        if (!(fieldName in httpRequest.body)) {
          return badRequest(new MissingParamError(fieldName))
        }
      }

      if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
  
      const isEmailValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}