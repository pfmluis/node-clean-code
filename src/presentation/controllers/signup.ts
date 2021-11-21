import { MissingParamError } from "../errors/missing-param-error"
import { badRequest } from "../helpers/http-helpers"
import { HttpRequest } from "../protocols/http-request"
import { HttpResponse } from "../protocols/http-response"

export class SignUpController {
  public handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'))
    }

    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }
  }
}