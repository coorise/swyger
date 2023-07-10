//import * as HTTP_STATUS from 'http-status';

import { IError, IHTTPError } from '../interfaces';
import { TypeplateError } from './index';

/**
 * @description Custom type upload error
 */
export class UploadError extends TypeplateError implements IHTTPError {

  /**
   * @description HTTP response status code
   */
  statusCode: number;

  /**
   * @description HTTP response status message
   */
  statusText: string;

  /**
   * @description HTTP response errors
   */
  errors: Array<string>;

  constructor(error: IError) {
    super('File upload was failed');
    this.statusCode = 400;
    this.statusText = error.name;
    // @ts-ignore
    this.errors = [ error.message ];
  }
}
