import HTTP_RESPONSE_CODE from "../../../../all-http-response-code";
import {mode} from "../../../../../config";
import findOne from "./find-one";
const deleteOne = async (driver,repository,data)=>{

  let response={}
  let node
  let errors= []
  let error= {
    message: HTTP_RESPONSE_CODE.MESSAGE._400,
    code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
    errors: []
  }

  let model
  try {
    //delete data
    let copy=driver?.map((drive)=>{
      return new Promise(async (resolve)=>{
        let dat
        try{
          if(drive){
            if(drive?.type === "mysql"){
              dat = await findOne(driver,repository,data); //data=user
              if(dat?.data){
                model=dat?.data
                const repo=await  repository?.repositorySQL(drive?.name.toString())
                await repo?.db?.delete(data); //data=user
              }else {
                errors.push({
                  msg:'The data is not found in database',
                  data:data
                })
              }

            }
            else{
              dat = await findOne(driver,repository,data); //data=user
              if(dat?.data){
                model=dat?.data
                const repo=await  repository?.repositoryMongo(drive?.name.toString())
                await repo?.db?.delete(data); //data=user
              }else {
                errors.push({
                  msg:'The data is not found in database',
                  data:data
                })
              }

            }
          }
        }catch (e) {
          if(mode==='development'){
            console.log('Error> ',drive.name,' multi deletion ','@service/delete-one', ': ',e)
          }
          errors.push({
            msg:'Error with deletion on database: '+e.toString()
          })
        }

        resolve(dat)
      })
    })
    await Promise.all(copy)
  }catch (e) {
    if(mode==='development'){
      console.log('Error>','@service/delete-one', ': ',e)
    }
    error.message=HTTP_RESPONSE_CODE.MESSAGE._500
    error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
    node={msg:'Internal error with server to /delete-one'}
  }


  response.data=model
  if(errors?.length>0){
    response.error=error
    response.error.errors=errors
  }
  if(node){
    response.error=error
    response.error.node=node
  }

  return response

}

export default deleteOne

