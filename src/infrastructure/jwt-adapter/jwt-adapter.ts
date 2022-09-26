import { Encryptor } from '../../data/protocols/cryptography/encryptor';

import jwt from 'jsonwebtoken'
import { Decryptor } from '../../data/protocols/cryptography/decryptor';

export class JwtAdapter implements Encryptor, Decryptor {
  
  constructor(private readonly secret: string) {}
  
  public async encrypt(value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secret)
  }

  public async decrypt(value: string): Promise<string> {
    jwt.verify(value, this.secret)

    return null
  }
}