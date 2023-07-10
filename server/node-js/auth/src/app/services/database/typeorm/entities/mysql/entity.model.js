import TypeSchema from "../../../../../helpers/common/model/typeorm/types.schema";
import MySQLType from "../../../../../helpers/common/model/typeorm/mysql/types.model";
import {EntitySchema} from "typeorm";
import glob from "glob-all";
import {Base} from "../../../../../config";

import fs from 'fs'


let base = Base
//console.log('file ',base)

let getFiles=(data=[
    base+'/app/rest/core/**/models/typeorm/*.schema.json',
    base+'/app/rest/api/**/models/typeorm/*.schema.json',
])=> {
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
        //return new Promise(async (resolve)=>{
        let schema
        try {
            schema=fs.readFileSync(file,{encoding:'utf8', flag:'r'})
        }catch (e) {
            console.log('error entity schema ',e)
        }
        let ModelMySQL

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
                    MySQLType
                )
            )

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
                }
                else {
                    names[key]=null

                }
            }

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
            //console.log('ReadFile ', Model)


            // @ts-ignore
            ModelMySQL = new EntitySchema(Model)
            arrayImport.push(ModelMySQL)
            eventEmitter.emit('entity-schema',{[schema.name+'MySQL']:ModelMySQL})
            //console.log('get Model ')
            //console.log('Get model  ',Object.assign({},new ModelMySQL.options.target()))

        }
        //resolve(ModelMySQL)
        //})
    })


}

export default arrayImport
