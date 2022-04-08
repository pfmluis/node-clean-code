import { Validator } from './validator'
import { ValidatorComposite } from './validator-composite'

interface SutType {
  sut: ValidatorComposite
  validatorStub1: Validator
  validatorStub2: Validator
}

const makeValidatorStub = () => {
  class ValidatorStub implements Validator {
    validate(input: any): Error {
      return null
    }
  }

  return new ValidatorStub()
}

const makeSut = (): SutType => {
  const validatorStub1 = makeValidatorStub()
  const validatorStub2 = makeValidatorStub()
  const sut = new ValidatorComposite([validatorStub1, validatorStub2])

  return {
    sut,
    validatorStub1,
    validatorStub2,
  }
}

describe('Validator Composite', () => {
  test('Should return an error if any of the validators errors', () => {
    const { sut, validatorStub1 } = makeSut()
    const error = new Error('some_validation_error')
    jest.spyOn(validatorStub1, 'validate').mockReturnValueOnce(error)

    const result = sut.validate({})
    expect(result).toEqual(error)
  })

  test('Should return an error if any of the validators errors', () => {
    const { sut } = makeSut()
    const result = sut.validate({})

    expect(result).toBe(null)
  })
})