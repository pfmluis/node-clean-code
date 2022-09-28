import { LoadSurveysRepository } from '../../protocols/db/load-surveys-repository'
import { SurveyModel } from '../../../domain/models/survey'
import { DbLoadSurveys } from './load-surveys'

type SutTypes = {
  loadSurveysRepositoryStub: LoadSurveysRepository
  sut: DbLoadSurveys
}

const makeFakeSurveys = (): SurveyModel[] => ([{
  question: 'some_question_1',
  answers: [{
    answer: 'answer_1',
    image: 'some_image_1'
  }, {
    answer: 'answer_2',
    image: 'some_image_2'
  }],
}, {
  question: 'some_question_2',
  answers: [{
    answer: 'answer_2',
    image: 'some_image_2'
  }],
},
])

const makeLoadSurveysRepositoryStub = () => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    public async loadAll(): Promise<SurveyModel[]> {
      return makeFakeSurveys()
    }
  }
  return new LoadSurveysRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepositoryStub()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

  return {
    loadSurveysRepositoryStub,
    sut
  }
}

describe('DbLoadSurveys', () => {
  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadSurveysRepositorySpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()

    expect(loadSurveysRepositorySpy).toHaveBeenCalled()
  });

  test('Should return LoadSurveysRepository result on success', async () => {
    const { sut } = makeSut()
    const result = await sut.load()

    expect(result).toEqual(makeFakeSurveys())
  });

  test('Should trow if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockRejectedValueOnce(new Error())
    
    await expect(sut.load).rejects.toThrow()
  });
});