import { Collection } from 'mongodb'
import { LogErrorRepository } from '../../../../data/protocols/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

describe('LogError Mongo Repository', () => {
  let errorsConnection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorsConnection = await MongoHelper.getConnection('errors')
    await errorsConnection.deleteMany({})
  })

  const makeSut = () => {
    const sut: LogErrorRepository = new LogMongoRepository()

    return {
      sut,
    }
  }

  test('Should create an error log', async () => {
    const { sut } = makeSut()
    await sut.logError('any_error')
    const count = await errorsConnection.countDocuments()

    expect(count).toBe(1)
  })
})