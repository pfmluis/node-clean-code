import { LoadSurveys } from '../../../../domain/use-cases/load-surveys';
import { serverError } from '../../../helpers/http/http-helpers';
import { Controller } from '../../../protocols/controller';
import { HttpRequest } from '../../../protocols/http-request';
import { HttpResponse } from '../../../protocols/http-response';

export class LoadSurveysController implements Controller {

  constructor(
    private readonly loadSurveys: LoadSurveys
  ) {}

  handle(request: HttpRequest): Promise<HttpResponse> {
    this.loadSurveys.load()

    return null
  }
}