import request from 'supertest'
import app from '../config/app'
import env from '../config/env'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { MongoHelper } from '../../infrastructure/db/mongodb/helpers/mongo-helper'


const surveyCollectionName = 'surveys'
const accountCollectionName = 'accounts'
let surveyCollection
let accountCollection

const makeFakeSurvey = () => ({
  question: 'any_question',
  answers: [{
    answer: 'any_answer1',
    image: 'any_image'
  }, {
    answer: 'any_answer2',
    image: 'any_image'
  }]
})

const makeAccessTokenAndUpdateUser = async (role?: string): Promise<string> => {
  const password = await hash('valid_password', 12)
  const result = await accountCollection.insert({
      email: 'valid.email@email.com',
      role,
      password
  })
  const id = result.ops[0]._id
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })
  
  return accessToken
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getConnection(surveyCollectionName)
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getConnection(accountCollectionName)
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 403 on success', async () => {
      await request(app)
        .post('/api/surveys')
        .send(makeFakeSurvey())
        .expect(403)
    })
  })

  test('Should return 403 on access with wrong role', async () => {
    const accessToken = await makeAccessTokenAndUpdateUser('some_role')

    await request(app)
      .post('/api/surveys')
      .set('x-access-token', accessToken)
      .send(makeFakeSurvey())
      .expect(403)
  })

  test('Should return 204 on success', async () => {
    const accessToken = await makeAccessTokenAndUpdateUser('admin')

    await request(app)
      .post('/api/surveys')
      .set('x-access-token', accessToken)
      .send(makeFakeSurvey())
      .expect(204)
  })

  describe('GET /surveys', () => {
    test('Should return 403 on if access token is not provided', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

  test('Should return 204 on success', async () => {
    const accessToken = await makeAccessTokenAndUpdateUser()

    await request(app)
      .get('/api/surveys')
      .set('x-access-token', accessToken)
      .expect(200)
  })
  })
})