import {ValidationController} from "@common/validation/typeorm/controller";
import schema from './parts'
class AuthValidation extends ValidationController{
}
export default new AuthValidation('auth',schema)
