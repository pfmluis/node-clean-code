import { AddAccount } from "../../../domain/use-cases/add-account"
import { InvalidParamError } from "../../errors/invalid-param-error"
import { MissingParamError } from "../../errors/missing-param-error"
import { badRequest, serverError, ok } from "../../helpers/http-helpers"
import { Controller } from "../../protocols/controller"
import { EmailValidator } from "../../protocols/email-validator"
import { HttpRequest } from "../../protocols/http-request"
import { HttpResponse } from "../../protocols/http-response"

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const fieldNames = ['name', 'email', 'password', 'passwordConfirmation']
      for (const fieldName of fieldNames) {
        if (!(fieldName in httpRequest.body)) {
          return badRequest(new MissingParamError(fieldName))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
  
      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        email,
        name,
        password
      })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}