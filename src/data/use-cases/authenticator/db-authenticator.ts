import { AuthenticationModel, Authenticator } from '../../../domain/use-cases/authenticator';
import { HashComparer } from '../../protocols/cryptography/hash-comparer';
import { Encryptor } from '../../protocols/cryptography/encryptor';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository';

export class DbAuthenticator implements Authenticator {
  
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: Encryptor,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
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

    const token = await this.tokenGenerator.encrypt(account.id)

    await this.updateAccessTokenRepository.update(account.id, token)

    return token
  }
}