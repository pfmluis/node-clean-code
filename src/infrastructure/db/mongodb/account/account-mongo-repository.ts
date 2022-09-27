import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository';
import { LoadAccountByTokenRepository } from '../../../../data/protocols/db/load-account-by-token-repository';
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/update-access-token-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/use-cases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';
import { map as accountMapper } from './account-mapper';

export class AccountMongoRepository implements 
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository {

  public async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getConnection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = result.ops[0]

    return accountMapper(account)
  }

  public async loadByEmail(email: string): Promise<AccountModel> {
    const connection = await MongoHelper.getConnection('accounts')
    const result = await connection.findOne({ email })

    return accountMapper(result)
  }

  public async loadByToken(accessToken: string, role?: string): Promise<AccountModel> {
    const connection = await MongoHelper.getConnection('accounts')
    const result = await connection.findOne({ 
      accessToken, 
      $or: [{ role }, { role: 'admin' }]
    })

    return accountMapper(result)
  }

  public async updateAccessToken(id: string, token: string): Promise<void> {
    const connection = await MongoHelper.getConnection('accounts')
    await connection.updateOne({ _id: id }, { $set: { accessToken: token }})
  }
}
