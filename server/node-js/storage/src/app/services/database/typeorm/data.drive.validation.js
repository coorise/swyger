// @ts-ignore
import glob from "glob-all";
import dataDriver from "../../../config/database/typeorm/data.drive-manager";
import {Base} from "../../../config";
import fs from "fs";


dataDriver.default=Object.assign(
    dataDriver.default,
    {path:'/'+Base+'/config/database/typeorm/data.drive-manager.js'}
)
let getFiles=(data=[
  Base+'/app/rest/core/**/connexions/typeorm/*.connexion.json',
  Base+'/app/rest/api/**/connexions/typeorm/*.connexion.json',
])=> {
  return glob.sync(
      data,
      {dot: true}
  )
}
const files=getFiles()

let i=0
if(files.length>0)
{
  files.map(async (file)=>{
    let schema
    try {
      schema=fs.readFileSync(file,{encoding:'utf8', flag:'r'})
      if(schema){
        schema=JSON.parse(schema)
        // @ts-ignore
        dataDriver['model'+i]=Object.assign(
            schema,
            {path:file})
        i++
      }
    }catch (e) {
      console.log('error database driver schema ',e)
    }


  })

}

//console.log('get connexion keys ', Object.keys(dataDriver))

let validateDriveModule = ()=> {
  let errors=[]
  let keys = Object.keys(dataDriver)
  keys?.map((key, i) => {
    // @ts-ignore
    let model = dataDriver[key]
    let error={
      path:model.path,
      read:[],
      write:[]
    }
    if(model?.read){
      const arrayRead=model.read
      arrayRead?.map((read,i)=>{
        if(!read.type){

          // @ts-ignore
          error.read.push({
            // @ts-ignore
            position:`[(${i})] of your array in read[]`,
            // @ts-ignore
            message:'Please set the type of database (mysql/mongodb)'
          })
        }
        if(!read.name){
          // @ts-ignore
          error.read.push({
            // @ts-ignore
            position:`[(${i})] of your array in read[]`,
            // @ts-ignore
            message:'Please set the name of the database'
          })
        }

      })
    }
    if(model?.write){
      const arrayWrite=model.write
      arrayWrite?.map((write)=>{
        if(!write.type){
          // @ts-ignore
          error.write.push({
            // @ts-ignore
            position:`[(${i})] of your array in write[]`,
            // @ts-ignore
            message:'Please set the type of database (mysql/mongodb)'
          })
        }
        if(!write.name){
          // @ts-ignore
          error.write.push({
            // @ts-ignore
            position:`[(${i})] of your array in write[]`,
            // @ts-ignore
            message:'Please set the name of the database'
          })
        }
      })
    }
    let result
    if(error.read.length>0){
      result={}
      // @ts-ignore
      result.path=error.path
      // @ts-ignore
      result.read=error.read
    }
    if(error.write.length>0){
      if(!result){
        result={}
      }
      // @ts-ignore
      result.path=error.path
      // @ts-ignore
      result.write=error.write
    }
    if(result){
      errors.push(result)
    }

  })
  if(errors.length>0){
    // @ts-ignore
    process.stdout.write(`error: \n ${JSON.stringify(errors,null,2)} \n`,);
    process.exit(1);
  }
}
export {validateDriveModule}
