import { LogErrorRepository } from '../../data/protocols/db/log-error-repository'
import { Controller } from "../../presentation/protocols/controller"
import { HttpRequest } from "../../presentation/protocols/http-request"
import { HttpResponse } from "../../presentation/protocols/http-response"

export class LogControllerDecorator  implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    const response = await this.controller.handle(request) 
    if (response.statusCode == 500) {
      this.logErrorRepository.logError(response?.body?.stack)
    }

    return response
  }
}