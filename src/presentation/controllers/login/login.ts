import { MissingParamError } from '../../errors/missing-param-error';
import { badRequest } from '../../helpers/http-helpers';
import { Controller } from '../../protocols/controller';
import { HttpRequest } from '../../protocols/http-request';
import { HttpResponse } from '../../protocols/http-response';

export class LoginController implements Controller {
  public async handle(request: HttpRequest): Promise<HttpResponse> {

    if (!request.body.password) {
      return badRequest(new MissingParamError('password is not defined'))
    }

    return badRequest(new MissingParamError('email is not defined'))
  }
  
}