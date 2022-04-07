import { CompareFieldsValidator } from '../../presentation/helpers/validators/compare-fields-validation'
import { RequiredFieldValidator } from '../../presentation/helpers/validators/required-field-validator'
import { ValidationComposite } from '../../presentation/helpers/validators/validator-composite'
import { makeSignupValidator } from './signup-validator'

jest.mock('../../presentation/helpers/validators/validator-composite')

describe('SignUpValidator Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignupValidator()
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidator('name'),
      new RequiredFieldValidator('email'),
      new RequiredFieldValidator('password'),
      new RequiredFieldValidator('passwordConfirmation'),
      new CompareFieldsValidator('passwordConfirmation', 'password')
    ])
  })
})