import { CompareFieldsValidator } from '../../presentation/helpers/validators/compare-fields-validation'
import { EmailFieldValidator } from '../../presentation/helpers/validators/email-validator'
import { RequiredFieldValidator } from '../../presentation/helpers/validators/required-field-validator'
import { ValidationComposite } from '../../presentation/helpers/validators/validator-composite'
import { EmailValidator } from '../../presentation/protocols/email-validator'
import { makeSignupValidator } from './signup-validator'

jest.mock('../../presentation/helpers/validators/validator-composite')

const makeEmailValidator = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('SignUpValidator Factory', () => {
  test('Should call ValidationComposite with all validations', () => {

    const emailValidator = makeEmailValidator()

    makeSignupValidator(emailValidator)
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidator('name'),
      new RequiredFieldValidator('email'),
      new RequiredFieldValidator('password'),
      new RequiredFieldValidator('passwordConfirmation'),
      new CompareFieldsValidator('passwordConfirmation', 'password'),
      new EmailFieldValidator('email', emailValidator)
    ])
  })
})