import {ValidationController} from "@common/validation/typeorm/controller";
import DataSchema from '../../models/typeorm/data.schema.json';
import schema from './parts'
class DataValidation extends ValidationController{
}
export default new DataValidation(DataSchema.name,schema)
