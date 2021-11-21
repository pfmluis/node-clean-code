import { MissingParamError } from "../errors/missing-param-error"
import { HttpRequest } from "../protocols/http-request"
import { HttpResponse } from "../protocols/http-response"

export class SignUpController {
  public handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name')
      }
    }

    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      }
    }
  }
}