import { AccountModel } from '../../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../../domain/use-cases/add-account';
import { Encryptor } from '../../protocols/encryptor';

export class DbAddAccount implements AddAccount {

  constructor(
    private readonly encryptor: Encryptor
  ) { }

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encryptor.encrypt(account.password)
    return Promise.resolve(null)
  }
}