import {TypeController} from '../../../../helpers/common/controller/typeorm';
import userService from '../services/typeorm/users.service';
import UserSchema from '../models/typeorm/users.schema.json';


class UserController extends TypeController {
  constructor(service, name) {
    super(service, name);
  }

}

export default new UserController(userService, UserSchema.name);
