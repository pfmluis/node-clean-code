import { hash } from 'bcrypt'
import request from 'supertest'
import { MongoHelper } from '../../infrastructure/db/mongodb/helpers/mongo-helper'
import app from '../config/app'


const surveyCollectionName = 'surveys'
let accountCollection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL || '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getConnection(surveyCollectionName)
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 204 on success', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'any_question',
          answers: [{
            answer: 'any_answer1',
            image: 'any_image'
          }, {
            answer: 'any_answer2',
            image: 'any_image'
          }]
        })
        .expect(403)
    })
  })
})