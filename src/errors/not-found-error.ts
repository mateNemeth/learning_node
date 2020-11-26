import { BaseError } from './base-error';

export class NotFoundError extends BaseError {
  public statusCode = 404;

  constructor(message: string = 'Not found') {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  public serializeErrors() {
    return [{ message: this.message }];
  }
}
