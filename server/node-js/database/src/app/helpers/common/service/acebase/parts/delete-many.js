import HTTP_RESPONSE_CODE from "../../../../all-http-response-code";
import {mode} from "../../../../../config";
import {deleteOne} from "../index";
const deleteMany = async (client,data)=>{

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
        let query

        if(data?.value){
          if(typeof data?.value=='object' && !Array.isArray(data?.value)){
            //console.log('remove key: ',data?.value)
            query=client?.query(data?.path)
            await Promise.all(Object.keys(data?.value).map(async (key)=>{
              await Promise.all(data?.value?.where.map(async (search)=>{
                return await new Promise(resolve=>{
                  query?.filter(...search)
                  resolve()
                })
              }))
            }))
            //query?.filter('version','==','1.2')
            query?.take(1)
          }else if(Array.isArray(data?.value)){
            model=[]
            //console.log('remove key: ',data?.path+'/'+data?.value[0])
            await Promise.all(data?.value.map(async (key,i)=>{
              return await new Promise(async (resolve)=>{
                model=await deleteOne(client,{
                  path:data.path,
                  value:data?.value[i]
                })
                if(model.data)
                model.push(model.data)
                resolve()
              })
            }))
          }


        }else {
          query=client?.ref(data?.path)
        }
        if(!Array.isArray(data?.value))
        await query(data?.path).get().then(async (resp)=>{
          const response=resp
          if(Array.isArray(response)){
            model=response.map(res=>res?.val())
            model=(!model.length>0)?model:[]
          }else {
            model=response?.val()
          }
          await query(data?.path).remove()?.then(()=>{
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
        })?.catch(e=>{})
      }
    }catch (e) {
      if(mode==='development'){
        console.log('Error> Acebase','@service/find-many', ': ',e)
      }
      errors.push({
        msg:'Error with writing on database: @service/find-many',
        data:data
      })
    }
  }catch (e) {
    if(mode==='development'){
      console.log('Error>','@service/find-many', ': ',e)
    }
    error.message=HTTP_RESPONSE_CODE.MESSAGE._500
    error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
    node={msg:'Internal error with server to /find-many'}
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

