import { SurveyModel } from '../../../domain/models/survey';
import { LoadSurveys } from '../../../domain/use-cases/load-surveys';
import { LoadSurveysRepository } from '../../protocols/db/load-surveys-repository';

export class DbLoadSurveys implements LoadSurveys {
  constructor(
    private readonly loadSurveysRepository: LoadSurveysRepository,
  ) {}

  public async load(): Promise<SurveyModel[]> {
    return await this.loadSurveysRepository.load()
  }
}