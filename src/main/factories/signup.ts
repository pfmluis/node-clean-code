import { BcryptAdapter } from '../../infrastructure/cryptography/bcrypt-adapter';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { AccountMongoRepository } from '../../db/mongodb/account-repository/account';
import { DbAddAccount } from '../../data/use-cases/add-account/db-add-account';
import { SignUpController } from '../../presentation/controllers/signup';
import { Controller } from '../../presentation/protocols/controller';
import { LogControllerDecorator } from '../decorators/log';


export const makeSignupController = (): Controller => {
  const bcryptSalt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(bcryptSalt)
  const accountMongoRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)

  return new SignUpController(emailValidatorAdapter, addAccount)
}