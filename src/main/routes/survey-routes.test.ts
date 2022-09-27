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

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL || '')
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

  describe('POST /signup', () => {
    test('Should return 403 on success', async () => {
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

  test('Should return 403 on access with wrong role', async () => {
    const password = await hash('valid_password', 12)
    const result = await accountCollection.insert({
        email: 'valid.email@email.com',
        role: 'some_role',
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

    await request(app)
      .post('/api/surveys')
      .set('x-access-token', accessToken)
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

  test('Should return 204 on success', async () => {
    const password = await hash('valid_password', 12)
    const result = await accountCollection.insert({
        email: 'valid.email@email.com',
        role: 'admin',
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

    await request(app)
      .post('/api/surveys')
      .set('x-access-token', accessToken)
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
      .expect(204)
  })
})