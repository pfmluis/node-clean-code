import { Authenticator } from '../../../domain/use-cases/authenticator';
import { MissingParamError } from '../../errors/missing-param-error';
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helpers';
import { Validator } from '../../helpers/validators/validator';
import { Controller } from '../../protocols/controller';
import { EmailValidator } from '../../protocols/email-validator';
import { HttpRequest } from '../../protocols/http-request';
import { HttpResponse } from '../../protocols/http-response';

export class LoginController implements Controller {

  constructor(
    private readonly validator: Validator,
    private readonly authenticator: Authenticator
  ) {

  }
  public async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(request.body)
      if (error) {
        return badRequest(error)
      }

      const { email, password } = request.body
      const accessToken = await this.authenticator.authenticate(email, password)

      if (!accessToken) {
        return unauthorized()
      }
      
      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
  
}