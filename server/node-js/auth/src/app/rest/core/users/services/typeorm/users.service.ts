// @ts-ignore
import {TypeService} from "@common/service/typeorm";
import userSchema from '../../models/typeorm/users.schema.json';

export class UserServices extends TypeService{

}
// @ts-ignore
export default new UserServices(userSchema.name,userSchema.connexion);
