import HTTP_RESPONSE_CODE from "../../../../all-http-response-code";
import {mode} from "../../../../../config";
const deleteMany = async (driver,repository,data)=>{

  let response={}
  let node
  let errors= []
  let error= {
    message: HTTP_RESPONSE_CODE.MESSAGE._400,
    code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
  }
  let model

  try {
    //delete data
    let copy=driver.map((drive)=>{
      return new Promise(async (resolve)=>{
        let dat
        try{
          if(drive){
            if(drive?.type === "mysql"){

              const repo=await  repository?.repositorySQL(drive?.name.toString())

              dat = await repo?.db?.delete(data); // data=[user1,user2,...]

              if(dat?.affected===0){
                errors.push({
                  msg:'The $data is not found in database',
                  data:data
                })
              }else {
                model=true
              }
            }
            else{
              const repo=await  repository?.repositoryMongo(drive?.name.toString())

              dat = await repo?.db?.delete(data);
              if(dat?.affected===0){
                errors.push({
                  msg:'The $data is not found in database',
                  data:data
                })
              }else {
                model=true
              }

            }
          }
        }catch (e) {
          if(mode==='development'){
            console.log('Error>', drive.name ,' multi deletion ','@service/delete-one', ': ',e)
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
      console.log('Error>','@service/delete-many', ': ',e)
    }
    error.message=HTTP_RESPONSE_CODE.MESSAGE._500
    error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
    node={msg:'Internal error with server to /delete-many'}
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

export default deleteMany

