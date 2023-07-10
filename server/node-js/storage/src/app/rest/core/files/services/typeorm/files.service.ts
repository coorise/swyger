import {TypeService} from "../../../../../helpers/common/service/typeorm";
import FileSchema from '../../models/typeorm/files.schema.json';

class FilesServices extends TypeService{

}
export default new FilesServices(FileSchema.name);
