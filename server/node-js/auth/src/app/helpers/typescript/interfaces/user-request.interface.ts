import { IRequest, IMedia } from './index';

/**
 * @description
 */
export interface IUserRequest extends IRequest {
  user?: any;
  // @ts-ignore
  logIn?: (user, { session }) => Promise<void>,
  files?: IMedia[],
  body: {
    token?: string,
    password?: string,
    passwordConfirmation?: string,
    passwordToRevoke?: string,
    isUpdatePassword: boolean
  }
  query: {
    email?: string,
    page?: any,
    perPage?: any
  }
}
