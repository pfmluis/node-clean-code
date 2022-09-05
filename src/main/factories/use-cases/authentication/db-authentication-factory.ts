import { DbAuthenticator } from '../../../../data/use-cases/authenticator/db-authenticator';
import { Authenticator } from '../../../../domain/use-cases/authenticator';
import { BcryptAdapter } from '../../../../infrastructure/cryptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../../../infrastructure/db/mongodb/account/account-mongo-repository';
import { JwtAdapter } from '../../../../infrastructure/jwt-adapter/jwt-adapter';
import env from '../../../config/env';

export const makeDbAuthenticator = (): Authenticator => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  
  return new DbAuthenticator(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}