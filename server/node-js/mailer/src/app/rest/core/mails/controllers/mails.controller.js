import {TypeController} from '../../../../helpers/common/controller';
import userService from '../services/mails.service';
import MailSchema from '../models/mails.schema.json';


class MailController extends TypeController {
  constructor(service, name) {
    super(service, name);
  }

}

export default new MailController(userService, MailSchema.name);
