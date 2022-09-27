import { Encryptor } from '../../data/protocols/cryptography/encryptor';

import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encryptor {
  
  constructor(private readonly secret: string) {}
  
  async encrypt(value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secret)
  }
}