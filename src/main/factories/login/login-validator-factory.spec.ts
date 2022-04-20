import { EmailFieldValidator } from '../../../presentation/helpers/validators/email-validator'
import { RequiredFieldValidator } from '../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../presentation/helpers/validators/validator-composite'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { makeLoginValidator } from './login-validator-factory'

jest.mock('../../../presentation/helpers/validators/validator-composite')

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
    makeLoginValidator()
    expect(ValidatorComposite).toHaveBeenCalledWith([
      new RequiredFieldValidator('email'),
      new RequiredFieldValidator('password'),
      new EmailFieldValidator('email', makeEmailValidator())
    ])
  })
})