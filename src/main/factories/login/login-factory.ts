import env from '../../config/env'
import { DbAuthenticator } from '../../../data/use-cases/authenticator/db-authenticator';
import { LogMongoRepository } from '../../../infrastructure/db/mongodb/log/log-repository';
import { LoginController } from '../../../presentation/controllers/login/login-controller';
import { Controller } from '../../../presentation/protocols/controller';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { makeLoginValidator } from './login-validator-factory';
import { AccountMongoRepository } from '../../../infrastructure/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../infrastructure/cryptography/bcrypt-adapter';
import { JwtAdapter } from '../../../infrastructure/jwt-adapter/jwt-adapter';

export const makeLoginController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const validator = makeLoginValidator()
  const authenticator = new DbAuthenticator(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)

  const loginController = new LoginController(validator, authenticator)
  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(loginController, logMongoRepository)
}