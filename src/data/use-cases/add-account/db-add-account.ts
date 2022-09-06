import { AccountModel } from '../../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../../domain/use-cases/add-account';
import { AddAccountRepository } from '../../protocols/db/add-account-repository';
import { Hasher } from '../../protocols/cryptography/hasher';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';

export class DbAddAccount implements AddAccount {

  constructor(
    private readonly encryptor: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadByEmailRepository: LoadAccountByEmailRepository,
  ) { }

  async add(account: AddAccountModel): Promise<AccountModel> {
    if (!!await this.loadByEmailRepository.loadByEmail(account.email)) {
      return null
    }
  
    const hashedPassword = await this.encryptor.hash(account.password)
    const accountData = { ...account, password: hashedPassword}
    return  await this.addAccountRepository.add(accountData)
  }
}