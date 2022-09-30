import { LogMongoRepository } from '../../../../infrastructure/db/mongodb/log/log-repository';
import { Controller } from '../../../../presentation/protocols/controller';
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator';
import { SurveyMongoRepository } from '../../../../infrastructure/db/mongodb/survey/survey-mongo-repository';
import { LoadSurveysController } from '../../../../presentation/controllers/survey/load-surveys/load-surveys-controller';
import { DbLoadSurveys } from '../../../../data/use-cases/load-surveys/load-surveys';

export const makeLoadSurveysController = (): Controller => {
  const dbSurveyRepository = new SurveyMongoRepository()
  const dbLoadSurveys = new DbLoadSurveys(dbSurveyRepository)
  const loadSurveysController = new LoadSurveysController(dbLoadSurveys)
  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(loadSurveysController, logMongoRepository)
}