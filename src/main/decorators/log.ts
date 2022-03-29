import { Controller } from "../../presentation/protocols/controller"
import { HttpRequest } from "../../presentation/protocols/http-request"
import { HttpResponse } from "../../presentation/protocols/http-response"

export class LogControllerDecorator  implements Controller {
  constructor (private readonly controller: Controller) {}

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    const response = await this.controller.handle(request) 
    if (response.statusCode == 500) {
      console.error(response.body)
    }

    return response
  }
}