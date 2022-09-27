import { AuthMiddleware } from '../../../presentation/middlewares/auth-middleware';
import { Middleware } from '../../../presentation/protocols/middlewares';
import { makeLoadAccountByToken } from '../use-cases/load-account-by-token/load-account-by-token-factory';

export const makeAuthMiddleware = (role: string): Middleware => {
  return new AuthMiddleware(makeLoadAccountByToken(), role)
}