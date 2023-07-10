// @ts-ignore
import {TypeService} from "@common/service/typeorm";
import DataSchema from '../../models/typeorm/data.schema.json';

export class DataServices extends TypeService{

}
// @ts-ignore
export default new DataServices(DataSchema.name,DataSchema.connexion);
