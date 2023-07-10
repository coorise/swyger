import HTTP_RESPONSE_CODE from "../../../../all-http-response-code";
import {mode} from "../../../../../config";
import Dayjs from "dayjs";
const updateMany =async (driver,repository,data)=>{

  let response={}
  let node
  let errors= []
  let error= {
    message: HTTP_RESPONSE_CODE.MESSAGE._400,
    code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
  }
  let model
  let datenow = Dayjs(new Date()).format('YYYY-MM-DD HH:ss')


  try {
    //saving copy
    let copy=driver?.map((drive)=>{
      return new Promise(async (resolve)=>{
        let dat
        try{
          if(drive){
            if(drive?.type === "mysql"){
              const repo=await  repository?.repositorySQL(drive?.name.toString())

              let listData = data.map((sub,i)=>{
                return new Promise(async (resolve,reject)=>{
                  delete sub.id
                  sub.updatedAt= datenow

                  const dat = await repo?.db?.findOne({
                    where: { uid:sub.uid }
                  });
                  const datS=Object.assign({},
                      dat)
                  /*const getKeys=Object.keys(dat)
                  getKeys.forEach((key)=>{
                    if(typeof dat[key] === 'function'){
                      delete dat[key]
                    }
                  })*/

                  const iData = Object.assign(
                      datS,
                      sub
                  )
                  resolve(iData)

                })
              })
              const arrayList=await Promise.all(listData)

              let models = await  repo?.db?.save(arrayList) //eg: data = [user1,user2]
              if(models){
                let ModelClass= {}
                if(repo?.model){
                  try {
                    const RepoModel=repo?.model
                    ModelClass=Object.assign({},new RepoModel())
                  }catch (e) {
                  }
                }
                const getKeys=Object.keys(ModelClass)
                getKeys.forEach((key)=>{
                  if(typeof ModelClass[key] !== 'function'){
                    delete ModelClass[key]
                  }
                })
                const list= models.map((sub)=>{
                  return new Promise((resolve)=>{
                    resolve(Object.assign({},ModelClass,sub))
                  })
                })
                model = await  Promise.all(list)
              }
            }
            else{
              const repo=await  repository?.repositoryMongo(drive?.name.toString())

              let listData = data.map((sub,i)=>{
                return new Promise(async (resolve,reject)=>{
                  sub.updatedAt= datenow

                  const dat = await repo?.db?.findOne({
                    where: { uid: {$eq:sub.uid} }
                  });
                  const datS=Object.assign({},
                      dat)

                  /*const getKeys=Object.keys(dat)
                  getKeys.forEach((key)=>{
                    if(typeof dat[key] === 'function'){
                      delete dat[key]
                    }
                  })*/

                  const iData = Object.assign(
                      datS,
                      sub
                  )
                  resolve(iData)

                })
              })
              const arrayList=await Promise.all(listData)

              let models = await  repo?.db?.save(arrayList) //eg: data = [user1,user2]
              if(models){
                let ModelClass= {}
                if(repo?.model){
                  try {
                    const RepoModel=repo?.model
                    ModelClass=Object.assign({},new RepoModel())
                  }catch (e) {
                  }
                }
                const getKeys=Object.keys(ModelClass)
                getKeys.forEach((key)=>{
                  if(typeof ModelClass[key] !== 'function'){
                    delete ModelClass[key]
                  }
                })
                const list=models.map((sub)=>{
                  return new Promise((resolve)=>{
                    resolve(Object.assign({},ModelClass,sub))
                  })
                })
                model = await  Promise.all(list)
              }

            }
          }
        }catch (e) {
          if(mode==='development'){
            console.log('Error> ', drive.name ,' multi update ','@service/update-many', ': ',e)
          }
          errors.push({
            msg:'Error with writing on database: @service/update-many',
            data:data
          })
        }


        resolve(dat)
      })
    })
    await Promise.all(copy)

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
export default updateMany
