import { NextFunction, Request, Response } from 'express';
import { Controller } from '../../../presentation/protocols/controller';
import { HttpRequest } from '../../../presentation/protocols/http-request';

export const adaptMiddleware = (middleware: Controller) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }

    const httpResponse = await middleware.handle(httpRequest)

    if (httpResponse.statusCode === 200 || httpResponse.statusCode === 204) {
      req['x-user'] = httpResponse.body
      next()
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}