import {ValidationController} from "@common/validation/controller";
import MailSchema from '../models/mails.schema.json';
import schema from './parts'
class MailValidation extends ValidationController{
}
export default new MailValidation(MailSchema.name,schema)
