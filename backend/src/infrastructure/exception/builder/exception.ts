import { ErrorIdentifier } from '../types';

export class Exception extends Error {
  constructor(
    public readonly identifier: ErrorIdentifier,
    public readonly details?: Record<string, any>,
  ) {
    super();
    Error.captureStackTrace(this, this.constructor);
  }
}
