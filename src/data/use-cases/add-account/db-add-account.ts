import { AccountModel } from '../../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../../domain/use-cases/add-account';
import { AddAccountRepository } from '../../protocols/add-account-repository';
import { Encryptor } from '../../protocols/encryptor';

export class DbAddAccount implements AddAccount {

  constructor(
    private readonly encryptor: Encryptor,
    private readonly addAccountRepository: AddAccountRepository
  ) { }

  async add(account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encryptor.encrypt(account.password)
    const accountData = { ...account, password: hashedPassword}
    return  await this.addAccountRepository.add(accountData)
  }
}