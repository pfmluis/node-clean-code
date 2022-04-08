import { MissingParamError } from '../../errors/missing-param-error'
import { RequiredFieldValidator } from './required-field-validator'

const fieldName = 'testField'

const makeSut = () => {
  return new RequiredFieldValidator(fieldName)
}

describe('Required Field Validator', () => {
  test('Should return MissingParamError if two fields do not match', () => {
    const sut = makeSut()
    const input = { }

    const result = sut.validate(input)
    expect(result).toEqual(new MissingParamError(fieldName))
  })

  test('Should return null if two fields match', () => {
    const sut = makeSut()
    const input = { [fieldName]: 'some_value' }

    const result = sut.validate(input)
    expect(result).toBe(null)
  })
})