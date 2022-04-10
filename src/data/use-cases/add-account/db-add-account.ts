import { AccountModel } from '../../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../../domain/use-cases/add-account';
import { AddAccountRepository } from '../../protocols/db/add-account-repository';
import { Hasher } from '../../protocols/cryptography/hasher';

export class DbAddAccount implements AddAccount {

  constructor(
    private readonly encryptor: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) { }

  async add(account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encryptor.hash(account.password)
    const accountData = { ...account, password: hashedPassword}
    return  await this.addAccountRepository.add(accountData)
  }
}