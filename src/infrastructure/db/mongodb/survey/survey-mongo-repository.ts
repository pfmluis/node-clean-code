import { AddSurveyRepository } from '../../../../data/protocols/db/add-survey-repository';
import { LoadSurveysRepository } from '../../../../data/protocols/db/load-surveys-repository';
import { SurveyModel } from '../../../../domain/models/survey';
import { AddSurveyModel } from '../../../../domain/use-cases/add-survey';
import { MongoHelper } from '../helpers/mongo-helper';
const SURVEY_COLLECTION_NAME = 'surveys'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  public async add(surveyData: AddSurveyModel): Promise<void> {
    await (await MongoHelper.getConnection(SURVEY_COLLECTION_NAME)).insert(surveyData)
  }

  public async loadAll(): Promise<SurveyModel[]> {
    return await (await MongoHelper.getConnection(SURVEY_COLLECTION_NAME)).find().toArray()
  }
}
