import {ValidationController} from "@common/validation/typeorm/controller";
import fileSchema from '../../models/typeorm/files.schema.json';
import schema from './parts'
class FileValidation extends ValidationController{
}
export default new FileValidation(fileSchema.name,schema)
