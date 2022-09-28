import { LoadSurveys } from '../../../../domain/use-cases/load-surveys';
import { ok, serverError } from '../../../helpers/http/http-helpers';
import { Controller } from '../../../protocols/controller';
import { HttpRequest } from '../../../protocols/http-request';
import { HttpResponse } from '../../../protocols/http-response';

export class LoadSurveysController implements Controller {

  constructor(
    private readonly loadSurveys: LoadSurveys
  ) {}

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
  
      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}