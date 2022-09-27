import { Router } from 'express';
import { adaptMiddleware } from '../adapters/express/express-middleware-adapter';
import { adaptRoute } from '../adapters/express/express-route-adapter';
import { makeAddSurveyController } from '../factories/controllers/add-survey/add-surey-controller-factory';
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory';

export default (router: Router): void => {
  router.post('/surveys', adaptMiddleware(makeAuthMiddleware('admin')), adaptRoute(makeAddSurveyController()))
}