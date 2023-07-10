// @ts-ignore
import {TypeService} from "@common/service";
import MailSchema from '../models/mails.schema.json';

export class MailService extends TypeService{

}
// @ts-ignore
export default new MailService(MailSchema.name);
