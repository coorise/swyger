import {ValidationController} from "../../../../helpers/common/validation/controller";
import schema from './parts'
class SchemasValidation extends ValidationController{
}
export default new SchemasValidation('schemas',schema)
