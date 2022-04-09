import { AddAccount } from "../../../domain/use-cases/add-account"
import { badRequest, serverError, ok } from "../../helpers/http/http-helpers"
import { Validator } from '../../protocols/validator'
import { Controller } from "../../protocols/controller"
import { HttpRequest } from "../../protocols/http-request"
import { HttpResponse } from "../../protocols/http-response"

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validator: Validator
  ) {}

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(request.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = request.body
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