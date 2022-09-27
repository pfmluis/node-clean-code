import { AddSurvey } from '../../../../domain/use-cases/add-survey';
import { badRequest, noContent, serverError } from '../../../helpers/http/http-helpers';
import { Controller } from '../../../protocols/controller';
import { HttpRequest } from '../../../protocols/http-request';
import { HttpResponse } from '../../../protocols/http-response';
import { Validator } from '../../../protocols/validator';

export class AddSurveyController implements Controller {

  constructor(
    private readonly validator: Validator,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(request.body)
      if (error) {
        return badRequest(error)
      }

      await this.addSurvey.add(request.body)
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }  
}