import { IQueryString } from './index';
import { Status } from '../types';

export interface IUserQueryString extends IQueryString {
  status?: Status;
  username?: string;
  email?: string;
  role?: string;
  website?: string;
}
