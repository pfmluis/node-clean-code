import { LogMongoRepository } from '../../../../infrastructure/db/mongodb/log/log-repository';
import { LoginController } from '../../../../presentation/controllers/auth/login/login-controller';
import { Controller } from '../../../../presentation/protocols/controller';
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator';
import { makeLoginValidator } from './login-validator-factory';
import { makeDbAuthenticator } from '../../use-cases/authentication/db-authentication-factory';

export const makeLoginController = (): Controller => {
const validator = makeLoginValidator()
  const loginController = new LoginController(validator, makeDbAuthenticator())
  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(loginController, logMongoRepository)
}