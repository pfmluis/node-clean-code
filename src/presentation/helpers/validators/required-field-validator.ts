import { MissingParamError } from '../../errors/missing-param-error';
import { Validator } from './validator';

export class RequiredFieldValidator implements Validator {
  constructor (private readonly fieldName) {}

  public validate(input: any): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
}