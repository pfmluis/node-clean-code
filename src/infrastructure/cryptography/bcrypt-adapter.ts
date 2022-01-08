import { Encryptor } from '../../data/protocols/encryptor'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encryptor {
  constructor(
    private readonly salt: number
  ) { }

  async encrypt(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }  
}