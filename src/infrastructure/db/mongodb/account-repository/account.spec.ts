import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account';

const accountCollectionName = 'accounts'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getConnection(accountCollectionName)
    await accountCollection.deleteMany({})
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
    expect(account.email).toBe('any_email@email.com')
    expect(account.name).toBe('any_name')
    expect(account.password).toBe('any_password')
  });

  test('Should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    const accountData = {
      email: 'any_email@email.com',
      name: 'any_name',
      password: 'any_password'
    }

    await (await MongoHelper.getConnection('accounts')).insertOne(accountData)

    const account = await sut.loadByEmail(accountData.email)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.email).toBe('any_email@email.com')
    expect(account.name).toBe('any_name')
    expect(account.password).toBe('any_password')
  })


  test('Should return a null if no account was found', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail("test_email@email.com")
    expect(account).toBeFalsy()
  })
});