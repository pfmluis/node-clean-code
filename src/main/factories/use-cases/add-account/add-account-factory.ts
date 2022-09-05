import { DbAddAccount } from '../../../../data/use-cases/add-account/db-add-account';
import { BcryptAdapter } from '../../../../infrastructure/cryptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../../../infrastructure/db/mongodb/account/account-mongo-repository';

export const makeAddAccount = (): DbAddAccount => {
  const bcryptSalt = 12
  const bcryptAdapter = new BcryptAdapter(bcryptSalt)
  const accountMongoRepository = new AccountMongoRepository()

  return new DbAddAccount(bcryptAdapter, accountMongoRepository)
}