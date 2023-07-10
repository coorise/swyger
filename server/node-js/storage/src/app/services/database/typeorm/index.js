import {typeDatabase} from './typeorm.config';
import { typeValidation } from './typeorm.validation';
import dbList from '../../../config/database/typeorm/typeorm.db-list'
import * as myTypeOrm from 'typeorm'

export {
  typeDatabase,
  typeValidation,
  dbList,
  myTypeOrm
}
