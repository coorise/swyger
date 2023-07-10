import HTTP_RESPONSE_CODE from "../../../../all-http-response-code";
import {mode} from "../../../../../config";
import Dayjs from "dayjs";
import {v4 as uuidv4,validate as isValidUUID} from "uuid";

const createOne =async (driver,repository,data)=>{
  let datenow = Dayjs(new Date()).format('YYYY-MM-DD HH:ss')
  data.createdAt=datenow
  data.updatedAt=datenow
  if(!isValidUUID(data.uid)){
    data.uid=uuidv4()
  }
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
    let copy=driver?.map((drive)=>{
      return new Promise(async (resolve)=>{
        let dat
        try{
          if(drive){
            if(drive?.type === "mysql"){
              const repo=await  repository?.repositorySQL(drive?.name.toString())
              let ModelClass= {}
              if(repo?.model){
                try {
                  const RepoModel=repo?.model
                  ModelClass=Object.assign({},new RepoModel())
                }catch (e) {
                }
              }
              const dat = Object.assign({},ModelClass,data)
              model=await  repo?.db?.save(dat)  //eg: data =user

            }
            else{

              const repo=await  repository?.repositoryMongo(drive?.name.toString())
              let ModelClass= {}
              if(repo?.model){
                try {
                  const RepoModel=repo?.model
                  ModelClass=Object.assign({},new RepoModel())
                }catch (e) {
                }
              }
              const dat = Object.assign({},ModelClass,data)
              model=await  repo?.db?.save(dat)  //eg: data =user

            }
          }
        }catch (e) {
          if(mode==='development'){
            console.log('Error> ', drive.name ,' multi copy ','@service/create-one', ': ',e)
          }
          errors.push({
            msg:'Error with writing on database: @service/create-one',
            data:data
          })
        }


        resolve(dat)
      })
    })
    await Promise.all(copy)
  }catch (e) {
    if(mode==='development'){
      console.log('Error>','@service/create-one', ': ',e)
    }
    error.message=HTTP_RESPONSE_CODE.MESSAGE._500
    error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
    node={msg:'Internal error with server to /create-one'}
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
export default createOne
