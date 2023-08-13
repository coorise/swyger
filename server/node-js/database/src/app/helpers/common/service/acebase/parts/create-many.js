import HTTP_RESPONSE_CODE from "../../../../all-http-response-code";
import {mode} from "../../../../../config";
import Dayjs from "dayjs";
import {v4 as uuidv4,validate as isValidUUID} from "uuid";
import createOne from "./create-one";


const createMany =async (client,data)=>{


  let response={}
  let node
  let errors= []
  let error= {
    message: HTTP_RESPONSE_CODE.MESSAGE._403,
    code: HTTP_RESPONSE_CODE.FORBIDDEN_CODE,
    errors: []
  }

  let model

  try {
    //saving copy
    try{
      if(client){
        if(Array.isArray(data?.value))
        for (const item of data?.value) {
          if(typeof item=='object'){
            const request=await createOne(client,{
              path:data?.path,
              value:item
            })
            if(request?.data){
              if(!Array.isArray(model)){
                model=[]
              }
              model.push(request.data)
            }else {
              errors.push(data?.error)
            }
          }
        }
      }
    }catch (e) {
      if(mode==='development'){
        console.log('Error> Acebase','@service/create-many', ': ',e)
      }
      errors.push({
        msg:'Error with writing on database: @service/create-many',
        data:data
      })
    }
  }catch (e) {
    if(mode==='development'){
      console.log('Error>','@service/create-many', ': ',e)
    }
    error.message=HTTP_RESPONSE_CODE.MESSAGE._500
    error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
    node={msg:'Internal error with server to /create-many'}
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
export default createMany
