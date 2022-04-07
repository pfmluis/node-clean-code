import { CompareFieldsValidator } from '../../presentation/helpers/validators/compare-fields-validation';
import { EmailFieldValidator } from '../../presentation/helpers/validators/email-validator';
import { RequiredFieldValidator } from '../../presentation/helpers/validators/required-field-validator';
import { ValidationComposite } from '../../presentation/helpers/validators/validator-composite';
import { EmailValidator } from '../../presentation/protocols/email-validator';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';


export const makeSignupValidator = (emailValidator: EmailValidator): ValidationComposite => {
  return new ValidationComposite([
    new RequiredFieldValidator('name'),
    new RequiredFieldValidator('email'),
    new RequiredFieldValidator('password'),
    new RequiredFieldValidator('passwordConfirmation'),
    new CompareFieldsValidator('passwordConfirmation', 'password'),
    new EmailFieldValidator('email', emailValidator)
  ])
}