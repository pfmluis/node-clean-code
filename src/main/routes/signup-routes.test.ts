import request from 'supertest'
import { MongoHelper } from '../../db/mongodb/helpers/mongo-helper'
import app from '../config/app'


const accountCollectionName = 'accounts'

describe('Signup Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getConnection(accountCollectionName)
    await accountCollection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Valid Name',
        email: 'valid.email@email.com',
        password: 'valid_password',
        passwordConfirm: 'valid_password'
      })
      .expect(200)
  })
})