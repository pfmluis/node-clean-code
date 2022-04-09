import { AuthenticationModel, Authenticator } from '../../../domain/use-cases/authenticator';
import { HashComparer } from '../../protocols/cryptography/hash-comparer';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email';

export class DbAuthenticator implements Authenticator {
  
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {}

  public async authenticate(auth: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(auth.email)
    if (!account) {
      return null
    }

    const compareResult = await this.hashComparer.compare(auth.password, account.password)
    if (!compareResult) {
      return null
    }

    return null
  }
}