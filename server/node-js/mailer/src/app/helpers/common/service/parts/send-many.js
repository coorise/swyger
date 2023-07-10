import HTTP_RESPONSE_CODE from "../../../all-http-response-code";
import {mode} from "../../../../config";
import sendOne from "./send-one";

const sendMany =async (request)=>{

  let response={}
  let node
  let errors= []
  let error= {
    message: HTTP_RESPONSE_CODE.MESSAGE._400,
    code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
  }
  let model
  try {
    if(request.data?.length>0){
      model=[]
      let array=request.data.map((data)=>{
        return new Promise(async (resolve)=>{
          let attachmentName=data?.attachmentName
          delete data.attachmentName
          let req={
            sendMail:request?.sendMail,
            data:{
              ...data,
              files:{
                attachments:request?.data?.files?.[attachmentName]
              }
            }
          }
          const resp=await sendOne(req)
          if(resp?.error){
            errors.push(resp.error?.message)
          }else {
            model.push(resp.data)
          }

          resolve()
        })
      })
      await Promise.all(array())
    }
  }catch (e) {
    if(mode==='development'){
      console.log('Error>','@service/send-one', ': ',e)
    }
    error.message=HTTP_RESPONSE_CODE.MESSAGE._500
    error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
    node={msg:'Internal error with server to /send-many'}
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
export default sendMany
