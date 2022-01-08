import { Encryptor } from '../../data/protocols/encryptor'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encryptor {
  constructor(
    private readonly salt: number
  ) { }

  encrypt(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt)
  }  
}