import {TypeController} from '../../../../helpers/common/controller/typeorm';
import fileService from '../services/typeorm/files.service';


class FileController extends TypeController {
  constructor(service, name) {
    super(service, name);
  }


}

export default new FileController(fileService, 'File');
