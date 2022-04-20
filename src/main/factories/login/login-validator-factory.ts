import { EmailFieldValidator } from '../../../presentation/helpers/validators/email-validator';
import { RequiredFieldValidator } from '../../../presentation/helpers/validators/required-field-validator';
import { ValidatorComposite } from '../../../presentation/helpers/validators/validator-composite';
import { EmailValidatorAdapter } from '../../adapters/validators/email-validator-adapter';


export const makeLoginValidator = (): ValidatorComposite => {
  return new ValidatorComposite([
    new RequiredFieldValidator('email'),
    new RequiredFieldValidator('password'),
    new EmailFieldValidator('email', new EmailValidatorAdapter())
  ])
}