import { MongoClient } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account';

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = () => {
    return new AccountMongoRepository()
    
  }

  test('Should return an account on success', async () => {
    const sut = makeSut()
    const accountData = {
      email: 'any_email@email.com',
      name: 'any_name',
      password: 'any_password'
    }

    const account = await sut.add(accountData)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.email).toBeTruthy()
    expect(account.name).toBeTruthy()
    expect(account.password).toBeTruthy()
    expect(account.email).toBe('any_email@email.com')
    expect(account.name).toBe('any_name')
    expect(account.password).toBe('any_password')
  });
});