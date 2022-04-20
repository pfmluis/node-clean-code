import { CompareFieldsValidator } from '../../../presentation/helpers/validators/compare-fields-validation';
import { EmailFieldValidator } from '../../../presentation/helpers/validators/email-validator';
import { RequiredFieldValidator } from '../../../presentation/helpers/validators/required-field-validator';
import { ValidatorComposite } from '../../../presentation/helpers/validators/validator-composite';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';


export const makeLoginValidator = (): ValidatorComposite => {
  return new ValidatorComposite([
    new RequiredFieldValidator('email'),
    new RequiredFieldValidator('password'),
    new EmailFieldValidator('email', new EmailValidatorAdapter())
  ])
}