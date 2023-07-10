import HTTP_RESPONSE_CODE from "../../../../all-http-response-code";
import {mode} from "../../../../../config";
import Dayjs from "dayjs";
import {v4 as uuidv4,validate as isValidUUID} from "uuid";


const createMany =async (driver,repository,datas)=>{
  let datenow = Dayjs(new Date()).format('YYYY-MM-DD HH:ss')
  let listData = datas.map((sub,i)=>{
    return new Promise(async (resolve,reject)=>{
      // @ts-ignore
      delete sub.id
      if(!isValidUUID(sub.uid)){
        sub.uid=uuidv4()
      }
      sub.createdAt=datenow
      sub.updatedAt=datenow
      resolve(sub)

    })
  })
  const data=await Promise.all(listData)

  let response={}
  let node
  let errors= []
  let error= {
    message: HTTP_RESPONSE_CODE.MESSAGE._400,
    code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
    errors: []
  }

  let model

  try {
    //saving copy
    let copy=driver?.map((drive)=>{
      return new Promise(async (resolve)=>{
        let dat
        try{
          if(drive){
            if(drive?.type === "mysql"){
              const repo=await  repository?.repositorySQL(drive?.name.toString())
              if(data){
                const list=data.map((sub)=>{
                  return new Promise((resolve)=>{
                    let ModelClass= {}
                    if(repo?.model){
                      try {
                        const RepoModel=repo?.model
                        ModelClass=Object.assign({},new RepoModel())
                      }catch (e) {
                      }
                    }
                    resolve(Object.assign({},ModelClass,sub))
                  })
                })
                let models = await  Promise.all(list)
                model = await  repo?.db?.save(models) // data= [user,user2,..]

              }
            }
            else{
              const repo=await  repository?.repositoryMongo(drive?.name.toString())
              if(data){
                const list=data.map((sub)=>{
                  return new Promise((resolve)=>{
                    let ModelClass= {}
                    if(repo?.model){
                      try {
                        const RepoModel=repo?.model
                        ModelClass=Object.assign({},new RepoModel())
                      }catch (e) {
                      }
                    }
                    resolve(Object.assign({},ModelClass,sub))
                  })
                })
                let models = await  Promise.all(list)
                model = await  repo?.db?.save(models) // data= [user,user2,..]
              }

            }
          }
        }catch (e) {
          if(mode==='development'){
            console.log('Error> ', drive.name ,' multi copy ','@service/create-many', ': ',e)
          }
          errors.push({
            msg:'Error with writing on database: @service/create-many',
            data:data
          })
        }

        resolve(dat)
      })
    })
    await Promise.all(copy)
  }catch (e) {
    if(mode==='development'){
      console.log('Error>','@service/create-many', ': ',e)
    }
    error.message=HTTP_RESPONSE_CODE.MESSAGE._500
    error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
    node={msg:'Internal error with server to /create-many'}
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
export default createMany
