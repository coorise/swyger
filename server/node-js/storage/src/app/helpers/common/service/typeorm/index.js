import createOne from "./parts/create-one";
import createMany from "./parts/create-many";
import findOne from "./parts/find-one";
import findMany from "./parts/find-many";
import deleteOne from "./parts/delete-one";
import deleteMany from "./parts/delete-many";
import updateOne from "./parts/update-one";
import updateMany from "./parts/update-many";
import DB from "../../../../config/database/typeorm/data.drive-manager";
import TypeRepository from "../../model/typeorm/type.repository";
import AsyncUtil from "async-utility";
import fs from "fs";
// @ts-ignore
import {Base} from "@config";

//visit: https://github.com/typeorm/typeorm/blob/master/docs/repository-api.md#treerepository-api
const typeRepository=new TypeRepository()
class TypeService {
    dat
    readDB
    writeDB
    entityName
    repository=async (entities)=>typeRepository.getRepository(entities, this.entityName)
    constructor(entityName,driverPath) {
        this.entityName=entityName
        let driverDB
        let schema
        if(driverPath && driverPath !==''){
            try {
                schema= fs.readFileSync(Base+'/app/rest/'+driverPath,{encoding:'utf8', flag:'r'})
            }catch (e) {
                console.log('error connexion schema ',e)
            }
            if(schema){
                driverDB=JSON.parse(schema)
            }

        }
        //console.log('schema ',driverDB)
        if(driverDB){
            // @ts-ignore
            this.readDB=driverDB.read
            // @ts-ignore
            this.writeDB=driverDB.write
        }else {
            this.readDB=DB.default.read
            this.writeDB=DB.default.write
        }

    }

    createOne=async (entities,data)=> await createOne(this.writeDB,await this.repository(entities),data)
    createMany=async (entities,data)=> await createMany(this.writeDB,await this.repository(entities),data)

    updateOne=async (entities,data)=> await updateOne(this.writeDB,await this.repository(entities),data)
    updateMany=async (entities,data)=> await updateMany(this.writeDB,await this.repository(entities),data)

    findOne=async (entities,data)=> await findOne(this.readDB,await this.repository(entities),data)
    findMany=async (entities,data)=> await findMany(this.readDB,await this.repository(entities),data)

    deleteOne= async (entities,data)=> await deleteOne(this.writeDB,await this.repository(entities), data)
    deleteMany=async (entities,data)=> await deleteMany(this.writeDB,await this.repository(entities), data)

}

export {
    createOne,
    createMany,
    findOne,
    findMany,
    deleteOne,
    deleteMany,
    updateOne,
    updateMany,
    TypeService

}
