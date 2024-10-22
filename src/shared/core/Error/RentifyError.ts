import { RentifyErrorCode } from './ErrorCode';

export type RentifyErrorDetails = Record<string, unknown>;

export interface RentifyErrorOptions<ErrorCode extends RentifyErrorCode> {
  message: string;
  code: ErrorCode;
  details?: RentifyErrorDetails;
  cause?: Error;
}

export class RentifyError extends Error {
  public readonly name: string = 'Rentify Error';
  public readonly code: RentifyErrorCode;
  public readonly details?: RentifyErrorDetails;
  public readonly cause?: Error | RentifyError;
  public readonly isRentifyError = true;

  private static makeMessage = (message: string, code: RentifyErrorCode) => `[${code}] ${message}`;

  public constructor({ message, code, details, cause }: RentifyErrorOptions<RentifyErrorCode>) {
    // @ts-ignore Typescript does not recognise 'cause' ? OR we have wrong TS version
    super(RentifyError.makeMessage(message, code), { cause });

    // Set prototype manually, as required since Typescript 2.2: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#example
    Object.setPrototypeOf(this, RentifyError.prototype);

    this.code = code;
    this.details = details;

    if (cause) {
      this.cause = cause;

      if ('stack' in cause) {
        this.stack = `${this.stack}\nCAUSE: ${cause.stack}`;
      }
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RentifyError);
    }
  }
}
