import { LogMongoRepository } from '../../../../infrastructure/db/mongodb/log/log-repository';
import { Controller } from '../../../../presentation/protocols/controller';
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator';
import { makeAddSurveyValidator } from './add-survey-validator-factory';
import { AddSurveyController } from '../../../../presentation/controllers/survey/add-survey/add-survey-controller';
import { DbAddSurvey } from '../../../../data/use-cases/add-survey/add-survey';
import { SurveyMongoRepository } from '../../../../infrastructure/db/mongodb/survey/survey-mongo-repository';

export const makeAddSurveyController = (): Controller => {
const validator = makeAddSurveyValidator()
  const dbAddSurveyRepository = new SurveyMongoRepository()
  const dbAddSurvey = new DbAddSurvey(dbAddSurveyRepository)
  const loginController = new AddSurveyController(validator, dbAddSurvey)
  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(loginController, logMongoRepository)
}