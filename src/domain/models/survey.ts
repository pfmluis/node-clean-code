export interface SurveyModel {
  question: string
  answers: SurveyAnswer[]
}

export interface SurveyAnswer {
  image?: string
  answer: string
}
