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
          let newPath=data?.value?.newPath
          delete data?.value.newPath
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


          if(newPath && model){

            //Later, If data is heavy, you can make a cron job from behind to rewrite path
            //---------Begin JOB---------------
            const replacePath=new RegExp(data.path,'g')
            model=JSON.stringify(model).replace(replacePath,newPath)
            model=JSON.parse(model)
            //-----------End JOB--------------
            let pathExists=await client?.ref(newPath)?.get().catch(e=>{})
            pathExists=pathExists?.val()
            let request=client?.ref(newPath)
            await client?.ref(data?.path)?.remove()?.then(async ()=>{
              if(pathExists){

                await request.update(model)?.then(async response=>{
                  model=await response?.get()
                  model=model.val()
                })?.catch(e=>{
                  //console.log('error ',e)
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

                await request.set(model)?.then(async response=>{
                  model=await response?.get()
                  model=model.val()
                })?.catch(e=>{
                  console.log('error ',e)
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

            })?.catch(e=>{})

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
