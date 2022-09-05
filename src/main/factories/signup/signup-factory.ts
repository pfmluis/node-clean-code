import { BcryptAdapter } from '../../../infrastructure/cryptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infrastructure/db/mongodb/account/account-mongo-repository';
import { DbAddAccount } from '../../../data/use-cases/add-account/db-add-account';
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller';
import { Controller } from '../../../presentation/protocols/controller';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { LogMongoRepository } from '../../../infrastructure/db/mongodb/log/log-repository';
import { makeSignupValidator } from './signup-validator-factory';
import { DbAuthenticator } from '../../../data/use-cases/authenticator/db-authenticator';
import { JwtAdapter } from '../../../infrastructure/jwt-adapter/jwt-adapter';
import env from '../../config/env';


export const makeSignupController = (): Controller => {
  const bcryptSalt = 12
  const signUpValidator = makeSignupValidator()
  const bcryptAdapter = new BcryptAdapter(bcryptSalt)
  const accountMongoRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const authenticator = new DbAuthenticator(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  
  const signUpController = new SignUpController(addAccount, signUpValidator, authenticator)
  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(signUpController, logMongoRepository)
}