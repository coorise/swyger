import {getConnection, Repository} from 'typeorm';
import {mode} from "../../../../config";


//get the table name : getManager().getRepository(User).metadata.tableName

export default class TypeRepository {
    constructor() {
    }

    getRepository(entities,entityName){
        return {
            repositorySQL:async (name) =>{
                //console.log('Get repository ',entities[entityName+'MySQL'])
                const repo={}
                const db=await getConnection(name)?.getRepository(entities[entityName+'MySQL'])
                const model=entities[entityName+'MySQL']?.options?.target
                try {
                    repo.db=db
                    repo.model=model
                }catch (e) {
                    if(mode==='development') console.log(e)
                }
                return repo
            },
            repositoryMongo:async (name)=>{
                //console.log('Get repository ',entities[entityName+'MongoDB'])
                const repo={}
                const db=await getConnection(name)?.getRepository(entities[entityName+'MongoDB'])
                const model=entities[entityName+'MongoDB']?.options?.target
                try {
                    repo.db=db
                    repo.model=model
                }catch (e) {
                    if(mode==='development') console.log(e)
                }
                return repo
            }
        }
    }
}