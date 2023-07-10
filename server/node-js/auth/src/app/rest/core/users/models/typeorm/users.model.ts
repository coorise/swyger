// @ts-ignore
import bcrypt from "bcryptjs";
import TypeModel from "../../../../../helpers/common/model/typeorm/types.model";
import { decorate } from 'ts-mixer';


//You can also get generated object with JSON , good for your api
// visit: https://github.com/typeorm/typeorm/issues/1818

export default class UserModel extends TypeModel{
  constructor() {
    super()
  }
  password: string;
  /**
   * @description Check that password matches
   *
   * @param password
   */
  verifyPassword=async (password: string): Promise<boolean>=> {
    return await bcrypt.compare(password, <string>this.password);
  }


}
