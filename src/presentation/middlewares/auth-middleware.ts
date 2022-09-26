import { AccessDeniedError } from '../errors/access-denied-error';
import { forbidden } from '../helpers/http/http-helpers';
import { HttpRequest } from '../protocols/http-request';
import { HttpResponse } from '../protocols/http-response';
import { Middleware } from '../protocols/middlewares';

export class AuthMiddleware implements Middleware {
  handle(request: HttpRequest): Promise<HttpResponse> {
    return Promise.resolve(forbidden(new AccessDeniedError()));
  }
  
}