import { SurveyModel } from '../../../../domain/models/survey'
import { LoadSurveys } from '../../../../domain/use-cases/load-surveys'
import { LoadSurveysController } from './load-surveys-controller'

type SutTypes = {
  loadSurveysStub: LoadSurveys
  sut: LoadSurveysController
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

const makeLoadSurveysStub = () => {
  class LoadSurveysStub implements LoadSurveys {
    public async load(): Promise<SurveyModel[]> {
      return makeFakeSurveys() 
    }
  }

  return new LoadSurveysStub()
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveysStub()
  const sut = new LoadSurveysController(loadSurveysStub)

  return {
    loadSurveysStub,
    sut
  }
}

describe('LoadSurveys Controller', () => {
  test('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSurveysSpy = jest.spyOn(loadSurveysStub, 'load')

    await sut.handle({})
    expect(loadSurveysSpy).toHaveBeenCalled()
  });
});