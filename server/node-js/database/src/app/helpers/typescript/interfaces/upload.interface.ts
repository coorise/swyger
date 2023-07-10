import { IStorage } from './index';

/**
 * @description
 */
export interface IUpload {
  // @ts-ignore
  diskStorage: ( { destination, filename } ) => IStorage;
  // eslint-disable-next-line id-blacklist
  // @ts-ignore
  any: () => ( req, res, next ) => void;
}
