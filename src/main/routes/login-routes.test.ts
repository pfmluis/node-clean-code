import { hash } from 'bcrypt'
import request from 'supertest'
import { MongoHelper } from '../../infrastructure/db/mongodb/helpers/mongo-helper'
import app from '../config/app'


const accountCollectionName = 'accounts'
let accountCollection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL || '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getConnection(accountCollectionName)
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 on success', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Valid Name',
          email: 'valid.email@email.com',
          password: 'valid_password',
          passwordConfirmation: 'valid_password'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on success', async () => {
      const password = await hash('valid_password', 12)
      await accountCollection.insert({
          email: 'valid.email@email.com',
          password
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'valid.email@email.com',
          password: 'valid_password',
        })
        .expect(200)
    })

    test('Should return 401 on user not found', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'valid.email@email.com',
          password: 'valid_password',
        })
        .expect(401)
    })
  })
})