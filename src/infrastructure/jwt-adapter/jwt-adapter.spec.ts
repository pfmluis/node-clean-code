import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign: () => {
    return Promise.resolve('token')
  },
  verify: () => {
    return Promise.resolve('any_value')
  },
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('Jwt Adapter', () => {
  describe('Encrypt', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
  
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })
  
    test('Should return result of jwt.sign', async () => {
      const sut = makeSut()
      const result = await sut.encrypt('any_id')
      expect(result).toBe('token')
    })
  
    test('Should throw if jwt.sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.encrypt('any_id')
  
      expect(promise).rejects.toThrow()
    })
  });

  describe('Decrypt', () => {
    test('Should call decode with correct values', async () => {
      const sut = makeSut()
      const decodeSpy = jest.spyOn(jwt, 'verify')
  
      await sut.decrypt('any_token')
      expect(decodeSpy).toHaveBeenCalledWith('any_token', 'secret')
    })
  
    test('Should return result of jwt.verify', async () => {
      const sut = makeSut()
      const result = await sut.decrypt('any_token')
      expect(result).toBe('any_value')
    })
  
    test('Should throw if jwt.verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockRejectedValueOnce(new Error() as never)
      const promise = sut.decrypt('any_token')
  
      expect(promise).rejects.toThrow()
    })
  });
})