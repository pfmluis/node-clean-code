import { CompareFieldsValidator } from '../../../presentation/helpers/validators/compare-fields-validation';
import { EmailFieldValidator } from '../../../presentation/helpers/validators/email-validator';
import { RequiredFieldValidator } from '../../../presentation/helpers/validators/required-field-validator';
import { ValidatorComposite } from '../../../presentation/helpers/validators/validator-composite';
import { EmailValidatorAdapter } from '../../adapters/validators/email-validator-adapter';


export const makeSignupValidator = (): ValidatorComposite => {
  return new ValidatorComposite([
    new RequiredFieldValidator('name'),
    new RequiredFieldValidator('email'),
    new RequiredFieldValidator('password'),
    new RequiredFieldValidator('passwordConfirmation'),
    new CompareFieldsValidator('passwordConfirmation', 'password'),
    new EmailFieldValidator('email', new EmailValidatorAdapter())
  ])
}