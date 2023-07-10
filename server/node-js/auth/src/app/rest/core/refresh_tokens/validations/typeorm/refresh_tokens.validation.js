import {ValidationController} from "@common/validation/typeorm/controller";
import refreshTokenSchema from '../../models/typeorm/refresh_tokens.schema.json';
import schema from './parts'
class RefreshTokenValidation extends ValidationController{
}
export default new RefreshTokenValidation(refreshTokenSchema.name,schema)
