import jwtDecode from "jwt-decode";
import AxiosService from "./axios/index.service.js";
import {v4} from "uuid";
import EventEmitter from "eventemitter3"
import objectPath from 'dottie'
import {AceBase} from "acebase";
import {authRoute, crudRoute, listenRoute, storageRoute} from './api-route.js'

class SwygerClient{
  #listen='/on'
  #requireAuth=true

  #redirectTo

  #extrasRef

  #storage
  #basePath
  #storageConfig
  #mail
  #eventEmitter=new EventEmitter()

  #syncWithLocal
  #dataBaseConnected
  #config
  #db
  constructor(config={}) {
    this.#config=config
    let {ENV,OFFLINE_DB_NAME}=this.#config
    this.#db=AceBase.WithIndexedDB(OFFLINE_DB_NAME?.STORAGE||'swyger_storage') //db = localStorage
    let doInInactivity=async ()=>{
      try {
        let userInfo
        let accessToken=localStorage.getItem('accessToken')
        let tokenIsExpired=(()=>{
          try {
            userInfo=JSON.parse(localStorage.getItem('userInfo')?localStorage.getItem('userInfo'):"{}")
            let decoded=jwtDecode(accessToken)
            return  Date?.parse(new Date(decoded?.exp*1000)?.toString())<Date.now()

          }catch (e) {
            return false
          }
        })()
        if(tokenIsExpired && userInfo.uid){
          try {
            if(ENV==='dev') console.log('Token expired on inactivity, Trying to request a new refresh token')
            //await new SwygerClient().init()?.auth?.user()
          }catch (e) {

          }
        }
      }catch (e) {

      }


    }
    //visit: https://developer.chrome.com/blog/using-requestidlecallback/
    if ("requestIdleCallback" in window) {
      // if method exists
      // do some work

      // call method requestIdleCallback() and
      // passing myLowPriorityJob() callback function
      // as first argument.
      requestIdleCallback(doInInactivity,
          //{timeout:AUTO_REFRESH_TOKEN_TIMEOUT}
      );
    } else {
      // just do the work
      // by using a polyfill or a shim
    }
  }
  init=(req)=>{
    let {ENV,HOST_SERVER,API_VERSION}=this.#config
    let offlineDatabaseHandler=async ()=>{

      let transaction='/transaction'
      let dataRef='/database'
      let trans=await this.#db?.ref(transaction)?.get()?.catch((e)=>{})
      let data=await this.#db?.ref(dataRef)?.get()?.catch((e)=>{})
      if(trans.exists()){
        trans=trans.val()
        let keys=Object.keys(trans)
        //console.log('Connected: ',socket?.database?.connected)
        //console.log('Keys: ',keys)
        if(keys?.length>0){
          for(let item in keys){
            let transaction=trans[item]
            if(transaction?.path && transaction?.method && transaction?.value)
              await this.init(req).database().ref(transaction?.path).req(
                transaction?.method,
                transaction?.path,
                transaction?.value
              ).val()
          }
          if(data.exists())
            await this.#db?.ref(dataRef)?.remove()?.catch((e)=>{})
          await this.#db?.ref(transaction)?.remove()?.catch((e)=>{})
        }

      }
    }

    req?.socket?.storage?.on('connect',()=>{
      //console.log('device connected')
      this.#dataBaseConnected=true
      offlineDatabaseHandler()
    })
    req?.socket?.storage?.on('disconnect',()=>{
      this.#dataBaseConnected=false
    })


    const axiosData=(data={})=>{

      let request={}
      if(data && Object.keys(data).length>0) request.data=data
      if(this.#storage){
        request.storage=this.#storage
        request.config=this.#storageConfig
      }
      if(this.#mail){
        let formData=new FormData()
        if(Array.isArray(data)){
          data.map((elt,i)=>{
            if(typeof elt=='object'){
              elt.attachmentName='attachment'+i
              elt?.attachments.forEach((file)=>{
                if(file?.data){
                  formData.append('attachments'+i,file?.data,file?.name)
                }else {
                  formData.append('attachments'+i,file)
                }
              })
            }
          })
          formData.append('field',JSON.stringify(request))
        }else {
          if(Array.isArray(data?.attachments)){
            data?.attachments.forEach((file)=>{
              if(file?.data){
                formData.append('attachments',file?.data,file?.name)
              }else {
                formData.append('attachments',file)
              }
            })
            delete request.data.attachments
            formData.append('field',JSON.stringify(request))
          }
        }
        request=formData
      }else
      if( this.#storage && data?.file) {
        //visit: https://developer.mozilla.org/en-US/docs/Web/API/FormData
        //visit: https://stackabuse.com/axios-multipart-form-data-sending-file-through-a-form-with-javascript/
        let formData=new FormData()
        if(data?.file){
          if(data.file?.data){
            formData.append('file',data.file?.data,data.file?.name)
          }else {
            formData.append('file',data.file)
          }
          delete request.data.file
          formData.append('field',JSON.stringify(request))
          //console.log('get form data, ',formData.get('file'))
        }else if(Array.isArray(data?.directory)){
          data?.directory.forEach((file)=>{
            if(file?.data){
              formData.append('file',file?.data,file?.name)
            }else {
              formData.append('file',file)
            }
          })
          delete request.data.directory
          formData.append('field',JSON.stringify(request))
          request=formData
        }
        request=formData

      }


      return request
    }
    let checkHttpAuthorization=async (result,callback)=>{
      if(result?.error?.token && this.#requireAuth){
        this.#requireAuth=false
        if(localStorage.getItem('refreshToken')){
          if(ENV==='dev') console.log('Token expired or not found: ',result.error?.token, ' Trying to request a new refresh token')
          let cb=await this?.init(req)?.auth()?.req(authRoute.refreshToken,
            {
              token:localStorage.getItem('refreshToken')
            }
          ).val()
          if(cb?.error){
            if(ENV==='dev') console.log('Refresh token expired or not found: ',cb)
            if(this.#redirectTo) window.top.location.href = this.#redirectTo
            return cb
          }else {
            if(cb?.data){
              if(ENV==='dev') console.log('We got a new refresh token ,',cb?.data)
              if(cb?.data?.token) localStorage.setItem('accessToken',cb?.data?.token)
              if(cb?.data?.refreshToken) localStorage.setItem('refreshToken',cb?.data?.refreshToken)
              if(ENV==='dev') console.log('Trying to restart your request...')
              if(typeof callback=='function'){
                return  await callback()
              }

            }
          }



        }

      }
      else {
        return result
      }

    }
    let removeCommonValue=()=>{
      //this.#listenID=undefined
      //this.#extrasRef=undefined
      //this.#newToken=undefined
    }

    const listenSocket=(socket,config,ref,callback=()=>{})=>{
      const listenLocal=this.#listen

      let eventName=config.version+listenLocal+config.base+ref
      eventName=eventName.replace(/\/\//g,'/')

      if(ENV==='dev') console.log('socket listen local path: ', eventName)
      socket?.on(eventName,callback)
    }
    const listenEmitter=(ref,callback=()=>{})=>{
      const listenLocal=this.#listen

      let eventName=API_VERSION?.STORAGE+listenLocal+ref
      eventName=eventName.replace(/\/\//g,'/')
      if(ENV==='dev') console.log('emitter listen local path: ', eventName)
      this.#eventEmitter?.on(eventName,callback)
    }
    let socketListener=(socket,config,node,ref)=>{

      if(this.#extrasRef) ref=ref+this.#extrasRef
      //console.log('listener ', ref)
      let listenReq={
        req: (callback) => {
          listenSocket(socket,config,ref+listenRoute.req, (res) => {
            if (!res?.error?.error?.token && !res?.error?.token || res?.data) {
              if (typeof callback == 'function') callback({...node, value: res})
            }
          })
          return node
        },
        create: (callback) => {
          listenSocket(socket,config,ref + listenRoute.create, (res) => {
            if (!res?.error?.error?.token && !res?.error?.token || res?.data) {
              if (typeof callback == 'function') callback({...node, value: res})
            }
          })
          return node
        },
        find: (callback) => {
          listenSocket(socket,config,ref + listenRoute.find, (res) => {
            if (!res?.error?.error?.token && !res?.error?.token || res?.data) {
              if (typeof callback == 'function') callback({...node, value: res})

            }
          })
          return node
        },
        get: (callback) => {
          listenSocket(socket,config,ref + listenRoute.get, (res) => {
            if (!res?.error?.error?.token && !res?.error?.token || res?.data) {
              if (typeof callback == 'function') callback({...node, value: res})
            }
          })
          return node
        },
        query: (callback) => {
          listenSocket(socket,config,ref + listenRoute.query, (res) => {
            if (!res?.error?.error?.token && !res?.error?.token || res?.data) {
              if (typeof callback == 'function') callback({...node, value: res})
            }
          })
          return node
        },
        update: (callback) => {
          listenSocket(socket,config,ref + listenRoute.update, (res) => {
            if (!res?.error?.error?.token && !res?.error?.token || res?.data) {
              if (typeof callback == 'function') callback({...node, value: res})
            }
          })
          return node
        },
        delete: (callback) => {
          listenSocket(socket,config,ref + listenRoute.delete, (res) => {
            if (!res?.error?.error?.token && !res?.error?.token || res?.data) {
              if (typeof callback == 'function') callback({...node, value: res})
            }
          })
          return node
        },
      }
      if(this.#storage){
        listenReq.upload=(callback) => {
          listenSocket(socket,config,ref + listenRoute.upload, (res) => {
            if (!res?.error?.error?.token && !res?.error?.token || res?.data) {
              if (typeof callback == 'function') callback({...node, value: res})
            }
          })
          return node
        }
      }

      return listenReq
    }
    let emitterListener=(path,node)=>{
      return {

        create: (callback) => {
          listenEmitter(path + listenRoute.create, (res) => {
            if (!res?.error || res?.data) {
              if (typeof callback == 'function') callback({...node, value: res})
            }
          })
          return node
        },
        find: (callback) => {
          listenEmitter(path + listenRoute.find, (res) => {
            if (!res?.error || res?.data) {
              if (typeof callback == 'function') callback({...node, value: res})

            }
          })
          return node
        },
        get: (callback) => {
          listenEmitter(path + listenRoute.get, (res) => {
            if (!res?.error || res?.data) {
              if (typeof callback == 'function') callback({...node, value: res})
            }
          })
          return node
        },
        query: (callback) => {
          listenEmitter(path + listenRoute.query, (res) => {
            if (!res?.error || res?.data) {
              if (typeof callback == 'function') callback({...node, value: res})
            }
          })
          return node
        },
        update: (callback) => {
          listenEmitter(path + listenRoute.update, (res) => {
            if (!res?.error || res?.data) {
              if (typeof callback == 'function') callback({...node, value: res})
            }
          })
          return node
        },
        delete: (callback) => {
          listenEmitter(path + listenRoute.delete, (res) => {
            if (!res?.error || res?.data) {
              if (typeof callback == 'function') callback({...node, value: res})
            }
          })
          return node
        },
      }
    }

    let AxiosReq=AxiosService.init(this.#config)

    let authRequest=(path='',data={},onRequest={},node={},callback)=>{
      path=path.trim()
      //path=path.replace(/\/\//g,'/')
      if(path.charAt(path.length-1)==='/') path=path.slice(0, -1)

      let handlerRequest=async ()=>{
        let request=async ()=>await AxiosReq('post',HOST_SERVER.AUTH+API_VERSION.AUTH+authRoute.base+path,axiosData(data))
        let result= await request()
        if(this.#requireAuth){
          result=await checkHttpAuthorization(result,async ()=> await request())
        }
        if(typeof callback=='function'){
          callback({...node,value:result})
        }
        return result
      }
      let handler=handlerRequest()
      removeCommonValue()
      return {...node,val:()=>handler}
    }
    let dataRequest=(method,path,data,onRequest={},node={},callback)=>{
      //path=path.replace(/\/\//g,'/')
      let handlerRequest=async ()=>{
        let request=async ()=>await AxiosReq(method,path,axiosData(data),onRequest)
        let result=await request()
        if(this.#requireAuth){
          result=await checkHttpAuthorization(result,async ()=> await request())
        }
        if(typeof callback=='function'){
          callback({...node,value:result})
        }
        return result
      }
      let handler=handlerRequest()
      removeCommonValue()
      return {...node,val:()=>handler}
    }
    let extractArgs=(args)=>{
      let onRequest={},callback
      let [data={},,,]=args
      //console.log('Sync with data', typeof data)
      if(args.length===1 && typeof data == "function"){
        callback=args[0]
        data={}
      }
      if(args.length===2){
        if(typeof args[1]=='object'){
          onRequest=args[1]
        }else if(typeof args[1]=='function'){
          callback=args[1]
        }
      }
      if(args.length>=3){
        let [,reqOn,cb,]=args
        if(typeof reqOn=='object') onRequest=reqOn
        callback=cb

      }

      return {
        data,
        onRequest,
        callback
      }
    }
    let generateQuickGuid=()=>{
      return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
    }
    let pathToJson=async (result={},method,path,value={})=>{

      path=path.replace(/^\//,'')
      path=path.replace(/\//g,'.')
      let childValue
      let database
      return await new Promise(resolve=>{
        //visit: https://www.npmjs.com/package/dottie
        switch (method) {
          case 'create':
            objectPath?.set(result,path,value)
            database=objectPath?.get(result,'root')
            childValue=objectPath?.get(result,path.replace('root.',''))
            if(childValue){
              result={
                database,
                data:childValue
              }
            }else {
              result={
                error:{
                  message:'We could not create value'
                }
              }
            }
            break;
          case 'update':
            let split=path.split('/')
            let start=split.shift()
            let updatePath=path.replace(start+'.','')
            let oldValue=objectPath?.get(result,path.replace('root.',''))
            //console.log('oldValue: ', oldValue)

            if(typeof oldValue=='object'){
              objectPath?.set(result,path,{
                ...oldValue,
                ...value
              })
            }else {
              objectPath?.set(result,path,value)
            }
            database=objectPath?.get(result,'root')
            childValue=objectPath?.get(result,path.replace('root.',''))
            if(childValue){
              result={
                database,
                data:childValue
              }
            }else {
              result={
                error:{
                  message:'We could not update value'
                }
              }
            }
            //console.log('newValue: ', childValue)
            break;
          case 'get':
            result=objectPath?.get(result,path)
            database=objectPath?.get(result,'root')
            childValue=objectPath?.get(result,path.replace('root.',''))
            if(childValue){
              result={
                data:childValue
              }
            }else {
              result={
                error:{
                  message:'We could not update value'
                }
              }
            }
            break;
          case 'delete':
            database=objectPath?.get(result,'root')
            childValue=objectPath?.get(result,path.replace('root.',''))
            objectPath?.set(result,path,undefined)
            if(childValue){
              result={
                database,
                data:childValue
              }
            }else {
              result={
                error:{
                  message:'We could not delete value'
                }
              }
            }
            break;
        }
        //console.log('get result: ',result)
        resolve(result)
      })
    }
    let localDatabase=(method,path,data={},node,callback)=>{
      path=path.replace(/\/\//g,'/')
      let handlerRequest=async ()=>{
        let transaction='/transaction'
        //pathToJson(path,'')
        let result,max
        let error={
          error:{
            message:'We could not execute the '+method+' method for path: '+path
          }
        }
        switch (method) {
          case 'create':
            await this.#db?.ref(path)?.set(data)?.catch((e)=>error)
            break;
          case 'update':
            await this.#db?.ref(path)?.update(data)?.catch((e)=>error)
            break;
          case 'query':
            let query=this.#db?.query(path)
            if(Array.isArray(data?.where)){
              await Promise.all(data?.where.map(async (search)=>{
                return await new Promise(resolve=>{
                  //query?.filter('version','==','1.0')
                  query?.filter(...search)
                  resolve()
                })
              }))
            }

            if(data?.take) query?.take(data?.take)
            if(data?.skip) query?.take(data?.skip)
            if(data?.order){
              if(Array.isArray(data?.order)){
                await Promise.all(data?.order.map(async (sort)=>{
                  return await new Promise(resolve=>{
                    query?.sort(...sort)
                    resolve()
                  })
                }))
              }
            }
            max=await query?.count()
            result=await query?.get({...data?.$option})?.catch((e)=>error)
            break;
          case 'delete':
            result=await this.#db?.ref(path)?.get()?.catch((e)=>error)
            await this.#db?.ref(path)?.remove()?.catch((e)=>error)
            break;
        }
        if(method!=='delete' && method!=='query')
        result=await this.#db?.ref(path)?.get({...data?.$option})?.catch((e)=>error)
        if(method==='query'){
          if(result.exists()){
            result=result?.getValues()
            result={
              data:result,
              max,
              take:data?.take,
              skip:data?.skip
            }

          }else {
            result={
              ...error
            }
          }
        }else {
          if(result.exists()){
            result=result?.val()
            result={
              data:result
            }

          }else {
            result={
              ...error
            }
          }
        }
        if(this.#syncWithLocal && node.auth().$currentUserId)
        if(!this.#dataBaseConnected && ['create','delete','update'].includes(method)){
          if(result?.data){

            let trans=await this.#db?.ref(transaction)?.get()?.catch((e)=>error)
            if(trans.exists()){
              trans=trans.val()
            }else {
              trans={}
            }
            let cuid
            let keys=Object.keys(trans)
            if(keys.length>0){
              cuid=keys.length+1
            }else {
              cuid=0
            }
            switch (method) {
              case 'create':
                 method='post'
                break;
              case 'update':
                method='put'
                break;
              case 'delete':
                method='delete'
                break;
            }
            if(method!=='get')
            await this.#db?.ref(transaction+'/'+cuid)?.set({
              path:path,
              method,
              uid:cuid,
              value:result.data
            })?.catch((e)=>error)

          }

        }



        /*try {
          result=JSON.parse(result)
        }catch (e) {
          result={}
        }

        if(typeof result!='object') result={}
        //console.log('database: ', result)
        result=await pathToJson(result,method,path,data)
        if(method!=='get')
        await new Promise((resolve)=>{
          try {
            let newDatabase=result?.database
            delete result.database
            db?.['setItem'](database,JSON.stringify(newDatabase))
          }catch (e) {

          }
          resolve()
        })*/

        const listenLocal=this.#listen
        let eventName=API_VERSION?.STORAGE+listenLocal+path+'/'+method
        //console.log('eventName: ',eventName)
        eventName=eventName.replace(/\/\//g,'/')
        this.#eventEmitter.emit(eventName,result)
        if(typeof callback=='function'){
          callback({...node,value:result})
        }
        return result
      }
      let handler=handlerRequest()
      removeCommonValue()
      return {...node,val:()=>handler}
    }
    let ready=(callback,socket)=>{
      if(typeof callback=='function')
        socket?.on('connect',callback)
    }
    let event=(path,socket)=>{
      let ref='%'+path
      let parent=this.init(req)
      delete parent.auth().login
      delete parent.auth().register
      return {
        private:(id=generateQuickGuid())=>{
          return parent.event(path + id)
        },
        child:(childPath)=>{
          return parent.event(path + childPath)
        },
        emit:(data,callback)=>{
          socket?.emit(ref,data)
          if(typeof callback=='function') parent.event(path).do(callback)
          return {
            ...parent.event(path),
            ...parent
          }
        },
        do:(callback)=>{
          socket?.on(ref,(result)=>{
            if(typeof callback=='function')
              callback({
                ...parent.event(path),
                ...parent,
                value:result
              })
          })
          return {
            ...parent.event(path),
            ...parent
          }
        },
        onAny:(callback)=>{
          socket?.onAny((eventName,args)=>{

            if(typeof callback =='function') callback(
              eventName,
              {
                value:args,
                ...parent.event(eventName),
                ...parent
              }
            )
          })
        }
      }
    }
    let apiService=(node,config,socket)=>{
      return {
        ...node,
        $io:socket,
        connected:()=>{
          return socket?.connected
        },
        event:(path)=>{
          return event(path,socket)
        },
        ready:(callback)=>{
          return ready(callback,socket)
        },
        ref:(path='')=>{
          return node.ref(path,config,socket)
        }
      }
    }
    return {
      $connected:this.#dataBaseConnected,
      activity:()=>{
        let parent=this.init(req)
        return { //window activities like onload...etc
          onStart:(callback)=>{//DOMContentLoaded
            //useful when u don't want to wait external assets data to load ( css,img , js), only DOM ex: <img id=''>
            if(typeof callback=='function')
            document.addEventListener("DOMContentLoaded", callback)
            return {
              ...parent,
              ...parent.activity()
            }
          },
          onCreate:(callback)=>{//onload
            // when all elements/resources(img,styles...) are fully loaded
            if(typeof callback=='function')
            window.onload = callback
            return {
              ...parent,
              ...parent.activity()
            }
          },
          onPause:(callback)=>{//beforeunload'
            window.addEventListener('beforeunload',function (e) {
              // user want to reload page , and u want to save some data  before
              if(typeof callback=='function')
                callback()
              e.returnValue='onbeforeunload'
            })
            return {
              ...parent,
              ...parent.activity()
            }
          },
          onResume:()=>{//for native devices
            return {
              ...parent,
              ...parent.activity()
            }
          },
          onLeave:(callback)=>{//onunload
            // user quit the page, we can do something in background ( set in ur database, user is offline)
            if(typeof callback=='function')
            window.onunload = callback
            return {
              ...parent,
              ...parent.activity()
            }
          },
        }
      },
      socket:{
        storage:req?.socket?.storage,
      },
      $randomUID:()=>v4(),
      $randomId:()=>generateQuickGuid(),
      $axios:AxiosService,
      local:(config={})=>{ //for offline mode
        const local=this.init(req)
        delete local.local
        delete local.auth().register
        delete local.auth().login
        return {
          database:(dataRef='/database')=>{// NoSQL only,  sync with the cache and the remote database,  if offline it will send data in background process

            return {
              ref:(path='/database')=>{
                let parent=this.init(req)
                delete parent.auth().login
                delete parent.auth().register
                path=path.trim()
                path=path.replace(/\/\//g,'/')
                dataRef=dataRef+'/'+path
                dataRef=dataRef.replace(/\/\//g,'/')

                if(path.charAt(path.length-1)==='/') path=path.slice(0, -1)
                return {
                  child:(childRef='')=>{
                    childRef=childRef.trim()
                    childRef=childRef.replace(/\/\//g,'/')
                    if(childRef.charAt(childRef.length-1)==='/') childRef=childRef.slice(0, -1)
                    if(childRef.charAt(0)!=='/') childRef='/'+childRef
                    return parent.local()?.database()?.ref(path+childRef)
                  },
                  push:(...args)=>{
                    let generatedUID=v4()
                    if(!args.length>0){
                      return {
                        getKey:()=>generatedUID
                      }
                    }else {
                      return parent.local()?.database()?.ref(path+'/'+generatedUID).create(args)
                    }
                  },
                  create:(...args)=>{
                    let node={
                      ...parent.local(config)?.database()?.ref(path),
                      ...parent
                    }
                    let {data,callback}=extractArgs(args)
                    return localDatabase(config,'create',dataRef,data,node,callback)

                  },
                  get:(...args)=>{
                    let node={
                      ...parent.local()?.database()?.ref(path),
                      ...parent
                    }
                    let {data,callback}=extractArgs(args)
                    return localDatabase('get',dataRef,data,node,callback)
                  },
                  find:(...args)=>{
                    let node={
                      ...parent.local()?.database()?.ref(path),
                      ...parent
                    }
                    let {data,callback}=extractArgs(args)
                    return localDatabase('get',dataRef,data,node,callback)
                  },
                  query:()=>{},
                  update:(...args)=>{
                    let node={
                      ...parent.local()?.database()?.ref(path),
                      ...parent
                    }
                    let {data,callback}=extractArgs(args)
                    return localDatabase('update',dataRef,data,node,callback)

                  },
                  delete:(...args)=>{
                    let node={
                      ...parent.local()?.database()?.ref(path),
                      ...parent
                    }
                    let {data,callback}=extractArgs(args)
                    return localDatabase('delete',dataRef,data,node,callback)
                  },
                  on:()=>{
                    let node={
                      ...parent.local()?.database()?.ref(path),
                      ...parent
                    }
                    return emitterListener(path, node);
                  },
                  onValue:(callback)=>{
                    let node={
                      ...parent.local()?.database()?.ref(path),
                      ...parent
                    }
                    let listen=parent.local()?.database()?.ref(path)
                    listen?.on()?.create(callback)
                    listen?.on()?.update(callback)
                    listen?.on()?.delete(callback)
                    return node
                  }
                }
              }
            }
          },
          cache:(path='/cache')=>{// NoSQL only, because we will save it in the browser.The data won't be sent to the remote server.
            let parent=this.init(req)
            delete parent.auth().login
            delete parent.auth().register
            return parent.local()?.database(path)
          },
          storage:()=>{// Will be only available for native device to read internal storage and permissions (android, PC, Mac)
            return {

            }
          }
        }
      },
      cron:(config)=>{},
      task:(config)=>{},
      storage:(location='local',config)=>{
        this.#syncWithLocal=false
        this.#storage=location
        switch (location) {
          case 'aws':
            break;
          case 'discord':
            this.#storageConfig={
              token:config?.token,
              channelId:config?.channelId
            }
            break;
        }
        const storage=this.init(req)
        delete storage.storage
        delete storage.auth().register
        delete storage.auth().login

        return apiService(storage,{
          host:HOST_SERVER.STORAGE,
          version:API_VERSION.STORAGE,
          base:storageRoute.base
        },req?.socket?.storage)

      },
      //for browser to detect if there is connection
      //visit: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
      $online:navigator?.onLine,
      auth:()=>{
        return {
          req:(path,data,callback)=>{
            let parent=this.init(req)
            delete parent.auth().login
            delete parent.auth().register
            let node={
              ...parent,
              ...parent.auth()
            }
            return authRequest(path+authRoute.req,data,null,node,callback)
          },
        }
      },
      syncDatabase:(shouldSync=true)=>{ //Sync with local database
        const sync=this.init(req)
        this.#syncWithLocal=typeof shouldSync =='boolean'?shouldSync:true
        return sync.database()
      },
      ref:(path='',config={
        host:HOST_SERVER.STORAGE,
        version:API_VERSION.STORAGE,
        base:storageRoute.base
      },socket=req?.socket?.database,requireAuth=true)=>{
        path=path.trim()
        path=path.replace(/\/\//g,'/')
        if(path.charAt(0)==='/' && path.length<=1) path='/root'
        if(path.charAt(path.length-1)==='/') path=path.slice(0, -1)
        const ref=config.host+config.version+config.base+path
        let parent=this.init(req)
        delete parent.auth().login
        delete parent.auth().register
        this.#requireAuth=requireAuth
        let requestRef={
          push:(...args)=>{
            let generatedUID=v4()
            if(!args.length>0){
              return {
                getKey:()=>generatedUID
              }
            }else {
              return parent.ref(path+'/'+generatedUID,config,socket).create(args)
            }
          },
          private:(id=generateQuickGuid())=>{
            //private /ps**/pe will be removed on server,
            //Will send /ps**/pe in socket only
            return parent.ref(path + '/ps' + id + '/pe',config,socket)
          },
          setAuthAccess:(required=true,redirect=this.#redirectTo)=>{
            this.#redirectTo=redirect
            return parent.ref(path,config,socket,required)
          },
          req:(...args)=>{
            let node={
              ...parent.ref(path,config,socket),
              ...parent
            }
            if(args.length>=2){
              let [method='post',data={},onRequest={},callback]=args
              if((typeof method==='string' && ['post','put','delete','get'].includes(method))){
                let customPath=crudRoute.req
                return dataRequest(method,ref+customPath,data,onRequest,node,callback)
              }
              return node
            }else {
              let callback=args.filter(arg=>typeof arg=='function')
              if(callback.length>0){
                callback=callback[0]
                if(typeof callback=='function')
                callback(node)
              }else {
                return node
              }
            }

          },
          child:(childRef='')=>{
            childRef=childRef.trim()
            childRef=childRef.replace(/\/\//g,'/')
            if(childRef.charAt(childRef.length-1)==='/') childRef=childRef.slice(0, -1)
            if(childRef.charAt(0)!=='/') childRef='/'+childRef
            return parent.ref(path+childRef,config,socket)
          },
          set:(...args)=>parent.ref(path,config,socket)?.create(...args),
          create:(...args)=>{
            //do online request
            let {data,onRequest,callback}=extractArgs(args)
            let customPath=crudRoute.create.one
            if(this.#storage){
              if(data?.file || data?.directory){
                return  parent.ref(path)?.upload(data,null, callback)
              }else {
                if(Array.isArray(data.folders)) customPath=crudRoute.create.many
              }
            }
            else if(Array?.isArray(data)){
              customPath=crudRoute.create.many
            }
            return dataRequest('post',ref+customPath,data,onRequest,node,callback)

          },
          find:(...args)=>{
            //do online request
            if(ENV==='dev') console.log('Find: We are online')
            let node={
              ...parent.ref(path,config,socket),
              ...parent
            }
            let {data,onRequest,callback}=extractArgs(args)
            let customPath=crudRoute.find.one
            if(this.#storage){
              if(Array.isArray(data?.files) || Array.isArray(data?.folders)){
                if(Array.isArray(data?.files)) data.isFolder=false
                if(Array.isArray(data?.folders)) data.isFolder=true
                customPath=crudRoute.find.many
              }
            }
            else if(Object.keys(data)?.length<=0 || data.order || data.where || data.$option || data.skip || data.take){
              customPath=crudRoute.find.many
            }
            return dataRequest('post',ref+customPath,data,onRequest,node,callback)


          },
          get:(...args)=>{
            //do online request
            let node={
              ...parent.ref(path,config,socket),
              ...parent
            }
            let {data,onRequest,callback}=extractArgs(args)
            let customPath=crudRoute.get.one
            if(this.#storage){
              if(Array.isArray(data?.files) || Array.isArray(data?.folders)){
                if(Array.isArray(data?.files)) data.isFolder=false
                if(Array.isArray(data?.folders)) data.isFolder=true

                customPath=crudRoute.get.many
              }
            }
            else if(Object.keys(data)?.length<=0 || data.order || data.where || data.$option || data.skip || data.take){
              customPath=crudRoute.get.many
            }
            return  dataRequest('get',ref+customPath+'?query='+JSON.stringify(axiosData(data)),null,onRequest,node,callback)
          },
          query:(...args)=>{
            if(parent.auth().$currentUserId && config?.host===HOST_SERVER?.DATABASE && this.#syncWithLocal && !this.#dataBaseConnected){
              //save data when offline to transaction and database locally, then do background process
              // when online to send data and erase previous transaction
              return parent.local()?.database()?.ref(path)?.query(...args)
            }else {
              //do online request
              let node={
                ...parent.ref(path,config,socket),
                ...parent
              }
              let {data,onRequest,callback}=extractArgs(args)
              //For SQL and NoSQL with TypeORM
              /*const data={
                    //relations:{comments:true}
                    //where:  { token:token } for mysql, //where: { token:{$eq:token} } for mongodb
                    //where:  data,
                    order:{
                      uid:'ASC',//DESC
                    },
                    //select:['fullName'],
                    //skip:5, //where entities should start , pagination start
                    //take:10, //number of data that should be taken , pagination end
              }*/
              //For Acebase database
              /*const data={
                where:  [
                  ['version','==','1.0']
                ],
                order:[
                  ['version']
                ],
                option:{
                  exclude:['title','name'],
                  include:['fullName'],
                  snapshots:false //don't use snapshot
                },
                skip:5, //where entities should start , pagination start
                take:10, //number of data that should be taken , pagination end
              }*/

              if(!data || data===''){
                data={
                  take:15
                }
                if(!this.#extrasRef && !data.order)
                  data.order={
                    uid:'ASC',
                  }
              }
              return dataRequest('get',ref+crudRoute.get.many+'?query='+JSON.stringify(axiosData(data)),null,onRequest,node,callback)
            }
          },
          update:(...args)=>{
            //do online request
            let node={
              ...parent.ref(path,config,socket),
              ...parent
            }
            let {data,onRequest,callback}=extractArgs(args)
            let customPath=crudRoute.update.one
            if(this.#storage){
              if(Array.isArray(data?.files) || Array.isArray(data?.folders)){
                if(Array.isArray(data?.files)) data.isFolder=false
                if(Array.isArray(data?.folders)) data.isFolder=true
                customPath=crudRoute.update.many
              }
            }
            else if(Array.isArray(data)){
              customPath=crudRoute.find.many
            }
            return dataRequest('put',ref+customPath,data,onRequest,node,callback)

          },
          delete:(...args)=>{
            if(parent.auth().$currentUserId && config?.host===HOST_SERVER?.STORAGE && this.#syncWithLocal && !this.#dataBaseConnected){
              //save data when offline to transaction and database locally, then do background process
              // when online to send data and erase previous transaction
              return parent.local()?.database()?.ref(path)?.delete(...args)
            }else {
              //do online request
              let node={
                ...parent.ref(path,config,socket),
                ...parent
              }
              let {data,onRequest,callback}=extractArgs(args)
              let customPath=crudRoute.delete.one
              if(this.#storage){
                if(Array.isArray(data?.files) || Array.isArray(data?.folders)){
                  if(Array.isArray(data?.files)) data.isFolder=false
                  if(Array.isArray(data?.folders)) data.isFolder=true
                  if(Object.keys(data).length<=0) data.isFolder=true
                  customPath=crudRoute.delete.many
                }
              }
              else if(Array.isArray(data) || data.where){
                customPath=crudRoute.delete.many
              }
              return dataRequest('delete',ref+customPath,data,onRequest,node,callback)
            }
          },
          on:()=>{
            let node={
              ...parent.ref(path,config,socket),
              ...parent
            }
            return socketListener(socket,config,node,path);
          },
          onValue:(callback)=>{
            let node={
              ...parent.ref(path,config,socket),
              ...parent
            }
            let listen=parent.ref(path,config,socket)
            listen?.on().create(callback)
            listen?.on().update(callback)
            listen?.on().delete(callback)
            listen?.on().upload(callback)
            return node
          }
        }
        if(this.#storage){
          requestRef.download=(...args)=>{
            let node={
              ...parent.ref(path,config,socket),
              ...parent
            }
            let {data,onRequest,callback}=extractArgs(args)
            let customPath=storageRoute.download.one
            if(Array.isArray(data?.files) || Array.isArray(data?.folders)){
              customPath=storageRoute.download.many
            }
            return dataRequest('get',ref+customPath+'?query='+JSON.stringify(axiosData(data)),null,onRequest,node,callback)

          }
          requestRef.upload=(...args)=>{
            let node={
              ...parent.ref(path,config,socket),
              ...parent
            }
            let {data,onRequest,callback}=extractArgs(args)

            /*//visit: https://thecodersblog.com/add-upload-progress-axios-request
            onRequest={
              onUploadProgress:(progress)=>{
                const {loaded,total}=progress
                let percent=Math.floor((loaded*100)/total)
                if(percent<100){
                  //do logic
                  //console.log(loaded, 'bytes of ',total,' bytes. ', percent)
                }
              }
            }*/

            let customPath=storageRoute.upload+'?query='+JSON.stringify({
              storage:this.#storage,
              config:this.#storageConfig
            })
            /*if(Array.isArray(data?.file) || Array.isArray(data?.directory)){
              customPath='/upload?storage='+this.#storage
            }*/
            return dataRequest('post', ref + customPath, data, onRequest, node, callback,);

          }
        }
        return requestRef
      },

    }

  }

}

const RemoteService={
  init:(config)=>{
    try{
      return (req={})=>new SwygerClient(config).init(req)
    }catch (e) {
      return {}
    }

  },

}
export default RemoteService
