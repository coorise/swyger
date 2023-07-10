import HTTP_RESPONSE_CODE from "../../../../all-http-response-code";
import {mode} from "../../../../../config";

const findOne = async (client,data)=>{

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
        /*const snapshot = await db.ref('game/config').get();
        if (snapshot.exists()) {
          model = snapshot.val();
        }*/
        //console.log('get user id: ', client.auth.user.email )
        let option={}
        let query
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
          //console.log('data?.value: ',data?.value)
          query=client?.query(path)
          if(typeof data?.value=='object'){
            await Promise.all(Object.keys(data?.value).map(async (key)=>{
              return await new Promise(resolve=>{
                query?.filter(key,'==',data?.value[key])
                resolve()
              })
            }))
          }
          //query?.filter('version','==','1.2')
          query?.take(1)

        }else {
          query=client?.ref(path)
        }
        //console.log('$option: ',option)
        await query?.get({...option}).then(response=>{
          if(Array.isArray(response)){
            model=response.map(res=>res?.val())
            model=(!model[0])?false:model[0]
          }else {
            model=(response?.val())?response?.val():false
          }

        })
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
        console.log('Error> Acebase','@service/find-one', ': ',e)
      }
      errors.push({
        msg:'Error with writing on database: @service/find-one',
        data:data
      })
    }
  }catch (e) {
    if(mode==='development'){
      console.log('Error>','@service/find-one', ': ',e)
    }
    error.message=HTTP_RESPONSE_CODE.MESSAGE._500
    error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
    node={msg:'Internal error with server to /find-one'}
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

export default findOne
