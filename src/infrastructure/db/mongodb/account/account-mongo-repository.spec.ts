import { AccountModel } from '../../../../domain/models/account';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account-mongo-repository';

const accountCollectionName = 'accounts'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
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

  describe('Add', () => {
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
  });

  describe('LoadByEmail', () => {
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
  })

  describe('LoadByEmail', () => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      const accountData = {
        email: 'any_email@email.com',
        name: 'any_name',
        password: 'any_password',
        accessToken: 'any_token'
      }
  
      await (await MongoHelper.getConnection('accounts')).insertOne(accountData)
  
      const account = await sut.loadByToken(accountData.accessToken)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.email).toBe('any_email@email.com')
      expect(account.name).toBe('any_name')
      expect(account.password).toBe('any_password')
      expect(account.accessToken).toBe('any_token')
    })

    test('Should return an account on loadByToken with role', async () => {
      const sut = makeSut()
      const accountData = {
        email: 'any_email@email.com',
        name: 'any_name',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'any_role'
      }
  
      await (await MongoHelper.getConnection('accounts')).insertOne(accountData)
  
      const account = await sut.loadByToken(accountData.accessToken, accountData.role)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.email).toBe('any_email@email.com')
      expect(account.name).toBe('any_name')
      expect(account.password).toBe('any_password')
      expect(account.accessToken).toBe('any_token')
      expect(account.role).toBe('any_role')
    })
  
  
    // test('Should return a null if no account was found', async () => {
    //   const sut = makeSut()
    //   const account = await sut.loadByEmail("test_email@email.com")
    //   expect(account).toBeFalsy()
    // })
  })

  describe('UpdateAccessToken', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const accountCollection = await MongoHelper.getConnection('accounts')
      const sut = makeSut()
      const accountData = {
        email: 'any_email@email.com',
        name: 'any_name',
        password: 'any_password'
      }
      const testToken = 'test_token'
  
      const testResult = await accountCollection.insertOne(accountData)
      await sut.updateAccessToken(testResult.ops[0]._id, testToken)
      const testFoundResult = await accountCollection.findOne({ email: accountData.email })
      
      expect(testFoundResult.accessToken).toBe(testToken)
    })
  });
});