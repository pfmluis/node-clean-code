import { AddAccountRepository } from '../../../data/protocols/add-account-repository';
import { AccountModel } from '../../../domain/models/account';
import { AddAccountModel } from '../../../domain/use-cases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';
import { map as accountMapper } from './account-mapper';

export class AccountMongoRepository implements AddAccountRepository {

  public async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getConnection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = result.ops[0]

    return accountMapper(account)
  }
}
