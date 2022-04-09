import { AuthenticationModel, Authenticator } from '../../../domain/use-cases/authenticator';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email';

export class DbAuthenticator implements Authenticator {
  
  constructor(private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

  public async authenticate(auth: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(auth.email)
    return null
  }
}