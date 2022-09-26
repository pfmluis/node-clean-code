import { LoadAccountByToken } from '../../domain/use-cases/load-account-by-token';
import { AccessDeniedError } from '../errors/access-denied-error';
import { forbidden, ok, serverError } from '../helpers/http/http-helpers';
import { HttpRequest } from '../protocols/http-request';
import { HttpResponse } from '../protocols/http-response';
import { Middleware } from '../protocols/middlewares';

export class AuthMiddleware implements Middleware {

  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = request.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role)
        if (account) {
          return ok({ accountId: account.id })
        }
      }
  
      return forbidden(new AccessDeniedError());
    } catch (error) {
      return serverError(error)
    }
  }
}