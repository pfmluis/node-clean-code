import { AddSurveyRepository } from '../../../../data/protocols/db/add-survey-repository';
import { AddSurveyModel } from '../../../../domain/use-cases/add-survey';
import { MongoHelper } from '../helpers/mongo-helper';
const SURVEY_COLLECTION_NAME = 'surveys'

export class SurveyMongoRepository implements AddSurveyRepository{
  async add(surveyData: AddSurveyModel): Promise<void> {
    await (await MongoHelper.getConnection(SURVEY_COLLECTION_NAME)).insert(surveyData)
  }
}
