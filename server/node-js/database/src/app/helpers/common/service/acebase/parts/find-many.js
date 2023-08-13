import HTTP_RESPONSE_CODE from "../../../../all-http-response-code";
import {mode} from "../../../../../config";
import {Like} from "typeorm";


//visit: https://github.com/appy-one/acebase#querying-data
const findMany = async (client,data)=>{

  let response={}
  let node
  let errors= []
  let error= {
    message: HTTP_RESPONSE_CODE.MESSAGE._403,
    code: HTTP_RESPONSE_CODE.FORBIDDEN_CODE,
  }

  let result

  try {
    //saving copy
    try{
      if(client){
        let query
        let option={}
        let path='/'
        if(data?.path){
          path=data?.path
          delete data?.path
        }
        if(data?.value?.$option){
          option=data?.value?.$option
        }
        delete data?.value?.$option
        if(data?.value && Object?.keys(data?.value)?.length>0){
          //console.log('get search value: ', data?.value)
          query=client?.query(path)
          if(Array.isArray(data?.value?.where)){
            await Promise.all(data?.value.where.map(async (search)=>{
              return await new Promise(resolve=>{
                query?.filter(...search)
                resolve()
              })
            }))
          }
          //query?.filter('version','==','1.0')
          if(data?.value?.take) query?.take(data?.value?.take)
          if(data?.value?.skip) query?.take(data?.value?.skip)
          if(data?.value?.order){
            if(Array.isArray(data?.value?.order)){
              await Promise.all(data?.value.order.map(async (sort)=>{
                return await new Promise(resolve=>{
                  query?.sort(...sort)
                  resolve()
                })
              }))
            }
          }
        }else {
          query=client?.ref(path)
        }

        await query?.get({...option}).then(async (response)=>{
          let model
              if(Array.isArray(response)){
                model=response.map(res=>res?.val())
                model=(!model[0])?[]:model
              }else {
                model=response?.val()
              }
              result={
                data:model,
                pagination:{
                  max:await query?.count(),
                  take:data?.pagination?.take,
                  skip:data?.pagination?.skip,
                }
              }

                }
            )
            ?.catch(e=>{
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

  response.data=result
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

export default findMany
