// import { LoginController } from '../../../presentation/controllers/login/login';
// import { Controller } from '../../../presentation/protocols/controller';
// import { LogControllerDecorator } from '../../decorators/log';
// import { LogMongoRepository } from '../../../infrastructure/db/mongodb/log-repository/log';
// import { makeLoginValidator } from './login-validator';


// export const makeLoginController = (): Controller => {
//   const validator = makeLoginValidator()

//   const loginController = new LoginController(validator, )
//   const logMongoRepository = new LogMongoRepository()

//   return new LogControllerDecorator(loginController, logMongoRepository)
// }