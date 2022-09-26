import { LoadAccountByToken } from '../../domain/use-cases/load-account-by-token';
import { AccessDeniedError } from '../errors/access-denied-error';
import { forbidden } from '../helpers/http/http-helpers';
import { HttpRequest } from '../protocols/http-request';
import { HttpResponse } from '../protocols/http-response';
import { Middleware } from '../protocols/middlewares';

export class AuthMiddleware implements Middleware {

  constructor(
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    const accessToken = request.headers?.['x-access-token']
    if (accessToken) {
      this.loadAccountByToken.load(accessToken)
    }

    return forbidden(new AccessDeniedError());
  }
}