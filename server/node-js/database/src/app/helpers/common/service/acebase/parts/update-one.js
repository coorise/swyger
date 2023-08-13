import HTTP_RESPONSE_CODE from "../../../../all-http-response-code";
import {mode} from "../../../../../config";
import findOne from "./find-one";

const updateOne =async (client,data)=>{
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
        if(typeof data?.value=='object'){
          if(Object?.keys(data?.value)?.length>0){
            await client?.ref(data?.path)?.update(data?.value)?.then(async response=>{
              model=await response?.get()
              model=model.val()
            })?.catch(e=>{
              const value=()=>{
                try {
                  return JSON?.parse(e?.request?.body)?.val
                }catch (e) {

                }
              }
              errors.push({
                code:e?.code,
                statusCode:e?.response?.statusCode,
                statusMessage:e?.response?.statusMessage,
                message:e?.message,
                path:e?.request?.path,
                value:value()
              })
            })
          }else {
            const request=await findOne(client, {path:data?.path})
            if(request?.data) model=request?.data
          }


        }

      }
    }catch (e) {
      if(mode==='development'){
        console.log('Error> Acebase','@service/update-one', ': ',e)
      }
      errors.push({
        msg:'Error with writing on database: @service/update-one',
        data:data
      })
    }
  }catch (e) {
    if(mode==='development'){
      console.log('Error>','@service/update-one', ': ',e)
    }
    error.message=HTTP_RESPONSE_CODE.MESSAGE._500
    error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
    node={msg:'Internal error with server to /update-one'}
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
export default updateOne
