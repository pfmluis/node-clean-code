import { Router } from 'express';
import { adaptRoute } from '../adapters/express/express-route-adapter';
import { makeLoginController } from '../factories/controllers/login/login-controller-factory';
import { makeSignupController } from '../factories/controllers/signup/signup-controller-factory';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignupController()))
  router.post('/login', adaptRoute(makeLoginController()))
}