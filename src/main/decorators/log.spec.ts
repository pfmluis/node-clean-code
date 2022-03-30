import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { serverError } from '../../presentation/helpers/http-helpers';
import { Controller } from "../../presentation/protocols/controller";
import { HttpRequest } from "../../presentation/protocols/http-request";
import { HttpResponse } from "../../presentation/protocols/http-response";
import { LogControllerDecorator } from "./log";

interface SutTypes {
  sut: LogControllerDecorator,
  controllerStub: Controller,
  logErrorRepositoryStub: LogErrorRepository,
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepository implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return Promise.resolve()
    }
  }

  return new LogErrorRepository()
}


const makeController = (): Controller => {
  class Controller implements Controller {
    async handle(_: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve({ body: {}, statusCode: 200 })
    }
  }

  return new Controller()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
      sut,
      controllerStub,
      logErrorRepositoryStub,
    }
}

describe('Log  Controller Decorator', () => {
  test('Should call the controller with request and return response', async () => {
    const { sut, controllerStub } = makeSut()
    const httpResponse: HttpResponse = { 
        body: {
            test: 'value'
        },
        statusCode: 200
    }
    const handleSpy = jest.spyOn(controllerStub, 'handle')
        .mockReturnValueOnce(Promise.resolve(httpResponse))
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const result = await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    expect(result.body).toEqual(httpResponse.body)
    expect(httpResponse.statusCode).toEqual(httpResponse.statusCode)
  });

  test('Should call logErrorRepository if controller returns error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'some stack'
    const error = serverError(fakeError)
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(error))
    const logRepoSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await sut.handle(httpRequest)
    expect(logRepoSpy).toHaveBeenCalled()
  });
})