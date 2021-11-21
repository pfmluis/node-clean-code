import { InvalidParamError } from "../errors/invalid-param-error"
import { MissingParamError } from "../errors/missing-param-error"
import { badRequest } from "../helpers/http-helpers"
import { EmailValidator } from "../protocols/email-validator"
import { HttpRequest } from "../protocols/http-request"
import { HttpResponse } from "../protocols/http-response"

export class SignUpController {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  public handle(httpRequest: HttpRequest): HttpResponse {
    const fieldNames = ['name', 'email', 'password', 'passwordConfirmation']
    for (const fieldName of fieldNames) {
      if (!(fieldName in httpRequest.body)) {
        return badRequest(new MissingParamError(fieldName))
      }
    }

    const isEmailValid = this.emailValidator.isValid(httpRequest.body.email)
    if (!isEmailValid) {
      return badRequest(new InvalidParamError('email'))
    }

  }
}