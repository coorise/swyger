import HTTP_RESPONSE_CODE from "../../../../all-http-response-code";
import {mode} from "../../../../../config";
import findOne from "./find-one";
const deleteOne = async (client,data)=>{

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
        let query

        let result=await findOne(client,{
          path:data.path,
          value:data?.value
        })
        if(result?.data){
          query=client?.ref(data?.path)
          await query.remove()?.then(()=>{
            model=result.data
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
          errors.push({
            message:'The item was not found'
          })
        }

      }
    }catch (e) {
      if(mode==='development'){
        console.log('Error> Acebase','@service/delete-one', ': ',e)
      }
      errors.push({
        msg:'Error with writing on database: @service/delete-one',
        data:data
      })
    }
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

