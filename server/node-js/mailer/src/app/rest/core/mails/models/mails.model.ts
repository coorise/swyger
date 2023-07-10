import TypeModel from "../../../../helpers/common/model/types.model";
import { decorate } from 'ts-mixer';


//You can also get generated object with JSON , good for your api
// visit: https://github.com/typeorm/typeorm/issues/1818

export default class UserModel extends TypeModel{
  constructor() {
    super()
  }
  name: string;

  age:string

  getName=()=>{
    return this.name
  }


}
