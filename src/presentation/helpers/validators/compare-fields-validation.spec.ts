import { InvalidParamError } from '../../errors/invalid-param-error'
import { CompareFieldsValidator } from './compare-fields-validation'

const fieldName = 'testField'
const fieldToBeComparedWith = 'testFieldToBeComparedWith'

const makeSut = () => {
  return new CompareFieldsValidator(fieldName, fieldToBeComparedWith)
}

describe('Compare Fields Validator', () => {
  test('Should return InvalidFieldError if two fields do not match', () => {
    const sut = makeSut()
    const input = { [fieldName]: 'some_value', [fieldToBeComparedWith]: 'some_different_value' }

    const result = sut.validate(input)
    expect(result).toEqual(new InvalidParamError(fieldName))
  })

  test('Should return null if two fields match', () => {
    const sut = makeSut()
    const input = { [fieldName]: 'some_value', [fieldToBeComparedWith]: 'some_value' }

    const result = sut.validate(input)
    expect(result).toBe(null)
  })
})