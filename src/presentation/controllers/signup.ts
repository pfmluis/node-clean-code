import { MissingParamError } from "../errors/missing-param-error"
import { badRequest } from "../helpers/http-helpers"
import { HttpRequest } from "../protocols/http-request"
import { HttpResponse } from "../protocols/http-response"

export class SignUpController {
  public handle(httpRequest: HttpRequest): HttpResponse {
    const fieldNames = ['name', 'email']
    for (const fieldName of fieldNames) {
      if (!(fieldName in httpRequest.body)) {
        return badRequest(new MissingParamError(fieldName))
      }
    }
  }
}