import { SurveyModel } from '../../../../domain/models/survey'
import { LoadSurveys } from '../../../../domain/use-cases/load-surveys'
import { ok, serverError } from '../../../helpers/http/http-helpers'
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

  test('Should throw if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockRejectedValueOnce(new Error())

    const response = await sut.handle({})
    expect(response).toEqual(serverError(new Error()))
  })
 
  test('Should return 200 on success', async () => {
    const { sut } = makeSut()

    const response = await sut.handle({})
    expect(response).toEqual(ok(makeFakeSurveys()))
  });
});