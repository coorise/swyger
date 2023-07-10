import HTTP_RESPONSE_CODE from "../../../../all-http-response-code";
import {mode} from "../../../../../config";
import Dayjs from "dayjs";

const updateOne =async (driver,repository,data)=>{
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
    data.updatedAt= Dayjs(new Date()).format('YYYY-MM-DD HH:ss')
    let copy=driver?.map((drive)=>{
      return new Promise(async (resolve)=>{
        let dat
        try{
          if(drive?.type ==="mysql"){
            const repo=await  repository?.repositorySQL(drive?.name.toString())
            dat = await repo?.db?.findOne({
              where: { uid:data.uid }
            });

            if(dat){
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

              const sub = Object.assign(
                  dat,
                  data
              )
              const datS= await repo.db.save(sub) //eg: data=user
              model=Object.assign({},ModelClass,datS)
            }

          }
          else {
            const repo=await  repository?.repositoryMongo(drive?.name.toString())

            dat = await repo?.db?.findOne({
              where: { uid:{$eq:data.uid} }
            });

            if(dat){
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

              const sub = Object.assign(
                  dat,
                  data
              )
              const datS= await  repo?.db?.save(sub)

              model=Object.assign({},ModelClass,datS)
            }

          }
        }catch (e) {
          if(mode==='development'){
            console.log('Error> ', drive.name ,' multi update ','@service/update-one', ': ',e)
          }
          errors.push({
            msg:'Error with updating on database: @service/update-one',
            data:data
          })
        }


        resolve()
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
export default updateOne
