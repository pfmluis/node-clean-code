import { InvalidParamError } from '../../errors/invalid-param-error';
import { EmailValidator } from '../../protocols/email-validator';
import { Validator } from './validator';

export class EmailFieldValidator implements Validator {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator,
  ) {}

  validate(input: any): Error {
    if (!this.emailValidator.isValid(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName)
    }
  }
}