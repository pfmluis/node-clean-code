import { BcryptAdapter } from '../../infrastructure/cryptography/bcrypt-adapter';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { AccountMongoRepository } from '../../infrastructure/db/mongodb/account-repository/account';
import { DbAddAccount } from '../../data/use-cases/add-account/db-add-account';
import { SignUpController } from '../../presentation/controllers/signup/signup';
import { Controller } from '../../presentation/protocols/controller';
import { LogControllerDecorator } from '../decorators/log';
import { LogMongoRepository } from '../../infrastructure/db/mongodb/log-repository/log';
import { makeSignupValidator } from './signup-validator';


export const makeSignupController = (): Controller => {
  const bcryptSalt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(bcryptSalt)
  const accountMongoRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signUpValidator = makeSignupValidator(emailValidatorAdapter)

  const signUpController = new SignUpController(addAccount, signUpValidator)
  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(signUpController, logMongoRepository)
}