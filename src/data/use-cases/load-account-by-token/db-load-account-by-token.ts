import { AccountModel } from '../../../domain/models/account';
import { LoadAccountByToken } from '../../../domain/use-cases/load-account-by-token';
import { Decryptor } from '../../protocols/cryptography/decryptor';
import { LoadAccountByTokenRepository } from '../../protocols/db/load-account-by-token-repository';

export class DbLoadAccountByToken implements LoadAccountByToken {

  constructor(
    private readonly decryptor: Decryptor,
    private readonly loadAccountByRepository: LoadAccountByTokenRepository,
  ) {}

  public async load(accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.decryptor.decrypt(accessToken)
    if (token) {
      await this.loadAccountByRepository.loadByToken(accessToken, role)
    }
    return null
  }

}