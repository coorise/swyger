import TypeSchema from "../../../../../helpers/common/model/typeorm/types.schema";
import MongoType from "../../../../../helpers/common/model/typeorm/mongodb/types.model";
import {EntitySchema} from "typeorm";
import glob from "glob-all";
import fs from "fs";
import {Base} from "../../../../../config";


let base = Base

let getFiles=(
    data=[
        base+'/app/rest/core/**/models/typeorm/*.schema.json',
        base+'/app/rest/api/**/models/typeorm/*.schema.json',
    ]
)=> {
    return glob.sync(
        data,
        {dot: true}
    )
}
const files=getFiles()
let arrayImport=[]
if(files.length>0)
{
    files.map(async (file )=>{
        //console.log('model ', file)
        //return new Promise(async (resolve)=>{
        let schema
        try {
            schema=fs.readFileSync(file,{encoding:'utf8', flag:'r'})
        }catch (e) {
            console.log('error entity schema ',e)
        }
        let ModelMongoDB

        if(schema){
            schema=JSON.parse(schema)
            let target= async ()=>{
                if(schema.function){
                    //console.log('Get module  ', schema.function)
                    return await import(schema.function)
                }
                return false

                //return false
            }


            //delete schema.target
            // @ts-ignore
            const Model=TypeSchema(
                Object.assign(
                    schema,
                    MongoType
                )
            )
            //console.log('ReadFile ', Model)
            let names={}
            let keys = Object.keys(schema.columns)

            for (let key of keys){
                if(schema.columns[key]?.default){
                    names[key]=schema.columns[key].default
                }
                else if(schema.columns[key]?.default===false){
                    names[key]=schema.columns[key].default
                }
                else if(schema.columns[key]?.default===0){
                    names[key]=schema.columns[key].default
                }else {
                    names[key]=null

                }
            }

            //console.log('Get names ', names)

            try {
                //visit: https://stackoverflow.com/questions/60434617/migrations-with-separate-entity-definition
                const result=await target()
                const createClass = (name, cls) => ({[name] : class extends cls {
                    constructor() {
                        super();
                        Object.assign(this,names)
                    }
                }}
                )[name];
                if(result){
                    Model.target=createClass(schema.name,result.default)
                }else {
                    Model.target=createClass(schema.name,class ExModel{})

                }

            }catch (e) {
                console.log('Error Model class: ', e.message)
            }

            // @ts-ignore
            ModelMongoDB = new EntitySchema(Model)
            arrayImport.push(ModelMongoDB)
            eventEmitter.emit('entity-schema',{[schema.name+'MongoDB']:ModelMongoDB})
            //console.log('get Model ')

        }
        //resolve(ModelMySQL)
        //})
    })


}
export default arrayImport
