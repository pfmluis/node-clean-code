import { AddSurvey, AddSurveyModel } from '../../../domain/use-cases/add-survey';
import { AddSurveyRepository } from '../../protocols/db/add-survey-repository';

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) {}

  async add(surveyData: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(surveyData)
  }
}