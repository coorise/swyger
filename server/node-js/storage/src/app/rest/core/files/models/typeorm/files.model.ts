import TypeModel from "../../../../../helpers/common/model/typeorm/types.model";
import { decorate } from 'ts-mixer';



//You can also get generated object with JSON , good for your api
// visit: https://github.com/typeorm/typeorm/issues/1818
/*

*/

export default class FileModel extends TypeModel{

  name: string;

  path: string;

  size: number;

  type: string;

  extension: string;

  downloadUrl: string;





  /**
   * @param payload Object data to assign
   */
  /*constructor(payload: Record<string, unknown>) {
    Object.assign(this, payload);
  }*/
  constructor() {
    super();
  }


  toJSON = () => {
    //const obj = this.toObject({ virtuals: true });
    let obj = Object.assign({},this);

    return obj;
  }

}
