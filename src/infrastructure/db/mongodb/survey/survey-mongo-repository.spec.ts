import { AddSurveyModel } from '../../../../domain/use-cases/add-survey';
import { MongoHelper } from '../helpers/mongo-helper';
import { SurveyMongoRepository } from './survey-mongo-repository';

const surveyCollectionName = 'surveys'

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'some_question',
  answers: [{
    answer: 'some_answer',
  }]
})

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const surveyCollection = await MongoHelper.getConnection(surveyCollectionName)
    await surveyCollection.deleteMany({})
  })

  const makeSut = () => {
    return new SurveyMongoRepository() 
  }

  test('Should add a survey on success', async () => {
    const sut = makeSut()
    await sut.add(makeFakeSurveyData())

    const result = await (await MongoHelper.getConnection(surveyCollectionName)).findOne({ question: 'some_question'})
    expect(result).toBeTruthy()
  });

});