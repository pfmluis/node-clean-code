export interface Decryptor {
  decrypt(value: string): Promise<string | null>
}