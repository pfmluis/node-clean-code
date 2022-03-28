import { DbAddAccount } from '../../data/use-cases/add-account/db-add-account';
import { AccountMongoRepository } from '../../db/mongodb/account-repository/account';
import { BcryptAdapter } from '../../infrastructure/cryptography/bcrypt-adapter';
import { SignUpController } from '../../presentation/controllers/signup';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';

export const makeSignupController = (): SignUpController => {
  const bcryptSalt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(bcryptSalt)
  const accountMongoRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)

  return new SignUpController(emailValidatorAdapter, addAccount)
}