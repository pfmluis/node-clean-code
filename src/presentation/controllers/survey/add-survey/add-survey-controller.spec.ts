import { HttpRequest } from '../../../protocols/http-request';
import { AddSurveyController } from './add-survey-controller'
import { Validator } from './../../../protocols/validator'
import { Controller } from '../../../protocols/controller';
import { badRequest } from '../../../helpers/http/http-helpers';

type SutTypes = {
  sut: Controller
  validatorStub: Validator
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
})

const makeValidatorStub = () => {
  class ValidatorStub implements Validator {
    validate(input: any): Error {
      return null as any
    }
  }

  return new ValidatorStub()
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const sut = new AddSurveyController(validatorStub)

  return {
    validatorStub,
    sut
  }
}

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const httpRequest = makeFakeRequest()
    const validatorSpy = jest.spyOn(validatorStub, 'validate')
    await sut.handle(httpRequest)

    expect(validatorSpy).toBeCalledWith(httpRequest.body)
  });

  test('Should return 400 if Validator returns error', async () => {
    const { sut, validatorStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new Error()))
  });
});