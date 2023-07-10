import HTTP_RESPONSE_CODE from "../../../../all-http-response-code";
import {mode} from "../../../../../config";

const createOne =async (client,data)=>{

  let response={}
  let node
  let errors= []
  let error= {
    message: HTTP_RESPONSE_CODE.MESSAGE._403,
    code: HTTP_RESPONSE_CODE.FORBIDDEN_CODE,
  }
  let model

  try {
    //saving copy
    try{
      if(client){
        if(typeof data?.value=='object'){
          await client?.ref(data?.path)?.set(data?.value)?.then(async (response)=>{
            model=await response?.get()
            model=model?.val()
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

        }

      }
    }catch (e) {
      if(mode==='development'){
        console.log('Error> Acebase','@service/create-one', ': ',e)
      }
      errors.push({
        msg:'Error with writing on database: @service/create-one',
        data:data
      })
    }
  }catch (e) {
    if(mode==='development'){
      console.log('Error>','@service/create-one', ': ',e)
    }
    error.message=HTTP_RESPONSE_CODE.MESSAGE._500
    error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
    node={msg:'Internal error with server to /create-one'}
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
export default createOne
