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
    await MongoHelper.connect(process.env.MONGO_URL!)
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

  describe('Add', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add(makeFakeSurveyData())
  
      const result = await (await MongoHelper.getConnection(surveyCollectionName)).findOne({ question: 'some_question'})
      expect(result).toBeTruthy()
    });
  });

  describe('Load all', () => {
    test('Should load all surveys', async () => {
      const expectedResult = [
        makeFakeSurveyData(),
        makeFakeSurveyData(),
      ]
      await (await MongoHelper.getConnection(surveyCollectionName)).insertMany(expectedResult)
      
      const sut = makeSut()
      const result = await sut.loadAll()

      expect(result.length).toBe(2)
      expect(result).toEqual(expectedResult)
    })
  })

});