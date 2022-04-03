import { Authenticator } from '../../../domain/use-cases/authenticator';
import { MissingParamError } from '../../errors/missing-param-error';
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helpers';
import { Controller } from '../../protocols/controller';
import { EmailValidator } from '../../protocols/email-validator';
import { HttpRequest } from '../../protocols/http-request';
import { HttpResponse } from '../../protocols/http-response';

export class LoginController implements Controller {

  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authenticator: Authenticator
  ) {

  }
  public async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = request.body
  
      if (!password) {
        return badRequest(new MissingParamError('password is not defined'))
      }
  
      if (!email) {
        return badRequest(new MissingParamError('email is not defined'))
      }
  
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new MissingParamError('email is not valid'))
      }

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