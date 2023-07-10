import HTTP_RESPONSE_CODE from "../../../../all-http-response-code";
import {mode} from "../../../../../config";
import updateOne from "./update-one";
const updateMany =async (client,data)=>{

  let response={}
  let node
  let errors= []
  let error= {
    message: HTTP_RESPONSE_CODE.MESSAGE._400,
    code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
  }
  let model


  try {
    //saving copy
    try{
      if(client){
        for (const item of data?.value) {
          if(typeof item=='object'){
            const request=await updateOne(client,{
              path:data?.path,
              newPath:data?.newPath,
              value:item
            })
            if(request?.data){
              if(!Array.isArray(model)){
                model=[]
              }
              model.push(request.data)
            }else {
              errors.push(request?.error)
            }
          }

        }

      }
    }catch (e) {
      if(mode==='development'){
        console.log('Error> Acebase','@service/update-many', ': ',e)
      }
      errors.push({
        msg:'Error with writing on database: @service/update-many',
        data:data
      })
    }
  }catch (e) {
    if(mode==='development'){
      console.log('Error>','@service/update-many', ': ',e)
    }
    error.message=HTTP_RESPONSE_CODE.MESSAGE._500
    error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
    node={msg:'Internal error with server to /update-many'}
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
export default updateMany
