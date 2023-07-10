import {TypeController} from '../../../../helpers/common/controller/typeorm';
import dataService from '../services/typeorm/data.service';
import DataSchema from '../models/typeorm/data.schema.json';


class DataController extends TypeController {
  constructor(service, name) {
    super(service, name);
  }

}

export default new DataController(dataService, DataSchema.name);
