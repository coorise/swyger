import HTTP_RESPONSE_CODE from "../../../../all-http-response-code";
import {mode} from "../../../../../config";

const findOne = async (driver,repository,data)=>{

  let response={}
  let node
  let errors= []
  let error= {
    message: HTTP_RESPONSE_CODE.MESSAGE._400,
    code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
  }



  let model
  let result

  try {
    let copy=driver?.map((drive)=>{
      return new Promise(async (resolve)=>{


        if(drive !=null) {
          try{
            if(drive?.type === "mysql"){

              const repo=await  repository?.repositorySQL(drive?.name.toString())

              const dat = await repo?.db?.findOne({
                //where:  { token:token },
                where:  data,
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
                model=Object.assign({}, ModelClass,dat)

              }

            }
            else{
              let subData = {}
              const keys = Object.keys(data)
              keys.forEach(key =>{
                /*const obj = {}
                obj[key]={
                  $eq:data[key]
                }*/
                subData=Object.assign(
                    subData,
                    {
                      [key]:{
                        $eq:data[key]
                      }

                    }
                )
              })
              const repo=await  repository?.repositoryMongo(drive?.name.toString())

              const dat = await repo?.db?.findOne({
                //where: { token:{$eq:token} }
                where: subData
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
                //console.log('get object ',ModelClass)

                const getKeys=Object.keys(ModelClass)
                getKeys.forEach((key)=>{
                  if(typeof ModelClass[key] !== 'function'){
                    delete ModelClass[key]
                  }
                })
                model=Object.assign({},ModelClass,dat)
              }
            }
          }catch (e) {
            if(mode==='development'){
              console.log('Error> ',drive.name,' single search ','@service/find-one', ': ',e)
            }
            errors.push({
              msg:'Error with finding on database: '+e.toString(),
              data
            })
          }

        }
        if(model) {
          /*const getKeys=Object.keys(model)
          getKeys.forEach((key)=>{
            if(typeof model[key] === 'function'){
              delete model[key]
            }
          })*/
          result= model
          driver=[]
        }
        resolve()
      })
    })
    await Promise.all(copy)
  }catch (e) {
    if(mode==='development'){
      console.log('Error>','@service/find-one', ': ',e)
    }
    error.message=HTTP_RESPONSE_CODE.MESSAGE._500
    error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
    node={msg:'Internal error with server to /find-one'}
  }


  response.data=(result)?result:false
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
