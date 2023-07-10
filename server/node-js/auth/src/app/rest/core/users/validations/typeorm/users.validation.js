import {ValidationController} from "@common/validation/typeorm/controller";
import userSchema from '../../models/typeorm/users.schema.json';
import schema from './parts'
class UserValidation extends ValidationController{
}
export default new UserValidation(userSchema.name,schema)
