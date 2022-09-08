import { RequiredFieldValidator } from '../../../../presentation/helpers/validators/required-field-validator';
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite';

export const makeAddSurveyValidator = (): ValidatorComposite => {
  return new ValidatorComposite([
    new RequiredFieldValidator('question'),
    new RequiredFieldValidator('answers'),
  ])
}