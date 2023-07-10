import HTTP_RESPONSE_CODE from "../../../all-http-response-code";
import {mode} from "../../../../config";

const sendOne =async (request)=>{
  let response={}
  let model
  let node
  let errors= []
  let error= {
    message: HTTP_RESPONSE_CODE.MESSAGE._400,
    code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
  }
  try {

    let envelope=request.data
    const attachments=[]
    let template={}
    if(request.data?.files?.attachments){
      if(request.data?.files.attachments?.length>0){
        for (let file of request.data?.files.attachments){
          attachments.push({
            filename:file.name,
            content:file.data,
            encoding:file.encoding,
            contentType:file.mimetype
          })
        }
      }else {
        const file=request.data?.files.attachments
        attachments.push({
          filename:file.name,
          content:file.data,
          encoding:file.encoding,
          contentType:file.mimetype
        })
      }

    }
    if(envelope?.html)
      template.html=envelope?.html
    if(envelope?.text)
      template.text=envelope?.text
    if(attachments.length>0)
      template.attachments=attachments

    const compose={}
    if(envelope?.from)
      compose.from=envelope?.from
    if(envelope?.to)
      compose.to=envelope?.to
    if(envelope?.subject)
      compose.subject=envelope?.subject
    if(envelope?.cc)
      compose.cc=envelope?.cc
    if(envelope?.bcc)
      compose.bcc=envelope?.bcc

    const resp=await request?.sendMail({
      ...compose,
      ...template
    },envelope?.config)
    //console.log('response mail, ',resp)
    if(resp?.error){
      error.errors=resp.error
    }else {
      model=resp.data
    }

  }catch (e) {
    if(mode==='development'){
      console.log('Error>','@service/send-one', ': ',e)
    }
    error.message=HTTP_RESPONSE_CODE.MESSAGE._500
    error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
    node={msg:'Internal error with server to /send-one'}
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
export default sendOne
