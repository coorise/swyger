import HTTP_RESPONSE_CODE from "../../../../all-http-response-code";
import {mode} from "../../../../../config";
import {Like} from "typeorm";


//visit: https://orkhan.gitbook.io/typeorm/docs/find-options
const findMany = async (driver,repository,data)=>{

  let response={}
  let node
  let errors= []
  let error= {
    message: HTTP_RESPONSE_CODE.MESSAGE._400,
    code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
  }

  let count

  let customOption={}
  const defaultOption={
    //relations:{comments:true}
    //where:  { token:token } for mysql, //where: { token:{$eq:token} } for mongodb
    //where:  data,
    order:{
      uid:'ASC',//DESC
    },
    //select:['fullName'],
    //skip:5, //where entities should start , pagination start
    //take:10, //number of data that should be taken , pagination end
  }
  if(data.where){
    customOption.where=data.where
  }
  if(data){
    if(data.order){
      customOption.order=data.order
    }
    if(data.select){
      customOption.select=data.select
    }
    if(data.skip){
      customOption.skip=data.skip
    }
    if(data.take){
      customOption.take=data.take
    }
  }



  let model=[]
  let result

  try {
    const fetchMany=driver?.map((drive)=>{
      return new Promise(async (mresolve)=>{

        if(drive !=null) {
          try{

            if(drive?.type === "mysql"){

              if(data.search){
                let subData = {}
                const keys = Object.keys(data.where)
                keys.forEach(key =>{
                  /*const obj = {}
                  obj[key]={
                    $eq:data[key]
                  }*/
                  subData=Object.assign(
                      subData,
                      {
                        [key]:
                            (data.search==='start')?
                                Like(`${data.where[key]}%`) // % = means wildcard = '****' infinite
                                : (data.search==='end')?
                                Like(`%${data.where[key]}`)
                                :   Like(`%${data.where[key]}%`)
                      }
                  )
                })

                customOption.where=subData
              }
              customOption=Object.assign(
                  defaultOption,
                  customOption
              )
              const repo=await  repository?.repositorySQL(drive?.name.toString())

              let models = await repo?.db?.find(
                  customOption
              );
              count =await repo?.db?.count(
                  customOption.where
              );

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

                const list =models.map((sub)=>{
                  return new Promise((resolve)=>{
                    resolve(Object.assign({},ModelClass,sub))
                  })
                })
                model = await  Promise.all(list)
              }

            }
            else {
              //visit: https://github.com/typeorm/typeorm/blob/master/docs/mongodb.md
              if(data.where){
                let subData = {}
                const keys = Object.keys(data.where)
                keys.forEach(key =>{
                  /*const obj = {}
                  obj[key]={
                    $eq:data[key]
                  }*/
                  subData=Object.assign(
                      subData,
                      {
                        [key]:
                            (data.search)?
                                //visit: https://www.w3schools.com/jsref/jsref_obj_regexp.asp
                                (data.search==='start')?
                                    new RegExp(`^${data.where[key]}*`)
                                    : (data.search==='end')?
                                    new RegExp(`*${data.where[key]}$`)
                                    :   new RegExp(`*${data.where[key]}*`)
                                : {$eq:data.where[key]}

                      }
                  )
                })
                customOption.where=subData
              }
              customOption=Object.assign(
                  defaultOption,
                  customOption
              )
              const repo=await  repository?.repositoryMongo(drive?.name.toString())

              let models = await repo?.db?.find(
                  customOption
              );
              count =await repo?.db?.count(
                  customOption.where
              );

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

            if(model.length>0) {

              /*const fetch=model.map((sub)=>{
                return new Promise((resolve)=>{
                  const getKeys=Object.keys(sub)
                  getKeys.forEach((key)=>{
                    if(typeof sub[key] === 'object'){
                      delete sub[key]
                    }
                  })
                  resolve(sub)
                })
              })*/

              //console.log('Get many one ', model)
              result= {
                pagination:{
                  skip:data?.skip,
                  take:data?.take,
                  max:(count)?count:1
                },
                data:model,
                //arrayList:await Promise.all(fetch)
              }

              driver=[]
            }
          }catch (e) {
            if(mode==='development'){
              console.log('Error> ', drive.name ,' multi search ','@service/find-many', ': ',e)
            }
            errors.push({
              msg:'Error with finding on database: @service/find-many: '+e.toString(),
              data:data
            })
          }



        }
        mresolve(result)
      })
    })
    await Promise.all(fetchMany)
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
