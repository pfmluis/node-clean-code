import { EmailFieldValidator } from '../../../../presentation/helpers/validators/email-validator'
import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite'
import { makeAddSurveyValidator } from './add-survey-validator-factory'

jest.mock('../../../../presentation/helpers/validators/validator-composite')


describe('AddSurvey Validator Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidator()
    expect(ValidatorComposite).toHaveBeenCalledWith([
      new RequiredFieldValidator('question'),
      new RequiredFieldValidator('answers'),
    ])
  })
})