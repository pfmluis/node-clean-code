import { InvalidParamError } from '../../errors/invalid-param-error';
import { Validator } from './validator';

export class CompareFieldsValidator implements Validator {

  constructor(
    private readonly fieldName: string,
    private readonly fieldToCompare: string,
  ) {}

  validate(input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToCompare]) {
      return new InvalidParamError(this.fieldName)
    }
  }
}