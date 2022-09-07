import { AddSurvey, AddSurveyModel } from '../../../domain/use-cases/add-survey';
import { AddSurveyRepository } from '../../protocols/db/add-survey-repository'
import { DbAddSurvey } from './add-survey'

type SutType = {
  addSurveyRepositoryStub: AddSurveyRepository
  sut: AddSurvey
}

const makeFakeSurvey = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
})

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(surveyData: AddSurveyModel): Promise<void> {}
  }

  return new AddSurveyRepositoryStub()
}

const makeSut = (): SutType => {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)

  return {
    addSurveyRepositoryStub,
    sut,
  }
}


describe('DbAddSurvey Usecase', () => {
  test('Should call AddSurveyRepository with correct values', async () => {

    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSurbeyRepositoryStubSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = makeFakeSurvey()
    await sut.add(surveyData)

    expect(addSurbeyRepositoryStubSpy).toHaveBeenCalledWith(surveyData)
  });

  test('Should call AddSurveyRepository with correct values', async () => {

    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const surveyData = makeFakeSurvey()
    const promise = sut.add(surveyData)

    await expect(promise).rejects.toThrow(new Error())
  });
});