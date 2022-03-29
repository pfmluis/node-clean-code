import { Controller } from "../../presentation/protocols/controller";
import { HttpRequest } from "../../presentation/protocols/http-request";
import { HttpResponse } from "../../presentation/protocols/http-response";
import { LogControllerDecorator } from "./log";

interface SutTypes {
  sut: LogControllerDecorator,
  controllerStub: Controller
}


const makeController = (): Controller => {
  class Controller implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve({ body: {}, statusCode: 200 })
    }
  }

  return new Controller()
}

const makeSut = (): SutTypes => {
  const controller = makeController()
  const sut = new LogControllerDecorator(controller)

  return {
      sut,
      controllerStub: controller
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
    expect(result.body).toHaveBeenCalledWith(httpResponse.body)
    expect(httpResponse.statusCode).toEqual(httpResponse.statusCode)
  });
})