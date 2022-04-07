import { CompareFieldsValidator } from '../../presentation/helpers/validators/compare-fields-validation';
import { RequiredFieldValidator } from '../../presentation/helpers/validators/required-field-validator';
import { ValidationComposite } from '../../presentation/helpers/validators/validator-composite';


export const makeSignupValidator = (): ValidationComposite => {
  return new ValidationComposite([
    new RequiredFieldValidator('name'),
    new RequiredFieldValidator('email'),
    new RequiredFieldValidator('password'),
    new RequiredFieldValidator('passwordConfirmation'),
    new CompareFieldsValidator('passwordConfirmation', 'password')
  ])
}