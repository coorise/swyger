import jwtDecode from "jwt-decode";
import AxiosService from "./axios/index.service.js";
import {v4} from "uuid";
import EventEmitter from "eventemitter3"
import {AceBase} from "acebase";
import {authRoute, crudRoute, emitRoute, listenRoute} from './api-route.js'

class SwygerClient{
  #requireAuth=true
  #redirectTo
  #dataBaseConnected
  #config
  #db
  constructor(config={}) {
    this.#config=config
    let {OFFLINE_DB_NAME}=this.#config
    this.#db=AceBase.WithIndexedDB(OFFLINE_DB_NAME?.AUTH||'swyger_auth') //db = localStorage
  }
  init=(req)=>{
    let {ENV,HOST_SERVER,API_VERSION}=this.#config

    const axiosData=(data={})=>{

      let request={}
      if(data && Object.keys(data).length>0) request.data=data

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
    let generateQuickGuid=()=>{
      return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
    }
    let handleUserInfo=({value,node},callback)=>{
      let result=value
      if(result?.data?.data){
        let userInfo=result?.data?.data
        let refreshToken=result?.data?.refreshToken
        let accessToken=result?.data?.token
        if(accessToken) localStorage.setItem('accessToken',accessToken)
        if(refreshToken)localStorage.setItem('refreshToken',refreshToken)
        if(userInfo) localStorage.setItem('userInfo', JSON.stringify(userInfo))
      }
      if(typeof callback=='function'){
        callback({
          ...node,
          value:result
        })
      }
    }
    let ready=(callback,socket)=>{
      if(typeof callback=='function')
        socket?.on('connect',callback)
    }
    let event=(path,socket)=>{
      let ref='%'+path
      let parent=this.init(req)?.auth()
      return {
        $connected:this.#dataBaseConnected,
        private:(id=generateQuickGuid())=>{
          return parent.event(path + id)
        },
        child:(childPath)=>{
          return parent.event(path + childPath)
        },
        push:(data,callback)=>{
          let event=parent.event(path)
          socket?.emit(ref,data)
          if(typeof callback=='function') event?.onValue(callback)
          return {
            ...event,
            ...parent
          }
        },
        onValue:(callback)=>{
          let event=parent.event(path)
          socket?.on(ref,(result)=>{
            if(typeof callback=='function')
              callback({
                ...event,
                ...parent,
                value:result
              })
          })
          return {
            ...event,
            ...parent
          }
        },
        onAnyValue:(callback)=>{
          socket?.onAny((eventName,args)=>{
            let event=parent.event(eventName)
            if(typeof callback =='function') callback(
              eventName,
              {
                value:args,
                ...event,
                ...parent
              }
            )
          })
          return {
            ...parent
          }
        }
      }
    }
    return {
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
        auth:req?.socket?.auth,
      },
      $randomUID:()=>v4(),
      $randomId:()=>generateQuickGuid(),
      $axios:AxiosService,
      //for browser to detect if there is connection
      //visit: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
      $online:navigator?.onLine,
      auth:()=>{
        return {
          $io:req?.socket?.auth,
          connected:()=>{
            return req?.socket?.auth?.connected
          },
          event:(path)=>{
            return event(path,req?.socket?.auth)
          },
          ready:(callback)=>{
            return ready(callback,req?.socket?.auth)
          },
          $currentUserId:(()=>{
            let userInfo=JSON.parse(localStorage.getItem('userInfo')?localStorage.getItem('userInfo'):"{}")
            if(userInfo.uid) return userInfo.uid
            return false
          })(),
          $status:(()=>{
            let userInfo=JSON.parse(localStorage.getItem('userInfo')?localStorage.getItem('userInfo'):"{}")
            if(userInfo.status){
              return userInfo.status
            }
            return undefined
          })(),
          status:(...args)=>{
            let userId,callback
            let parent=this.init(req)
            delete parent.auth().login
            delete parent.auth().register
            if(args.length===1){
              if(typeof args[0]=='string') userId=args[0]
              else if(typeof args[0]=='function') callback=args[0]
            }else if(args.length>=2) {
              const [id,cb,]=args
              if(typeof id=='string') userId=id
              callback=cb
            }
            let socketId=req?.socket?.auth?.id
            if(socketId){
              if(!userId){
                let userInfo=JSON.parse(localStorage.getItem('userInfo')?localStorage.getItem('userInfo'):"{}")
                if(userInfo.uid){
                  userId=userInfo.uid
                }
              }
              if(userId && socketId){
                req?.socket?.auth?.on(API_VERSION?.AUTH+listenRoute.user.status,(resp)=>{
                  if(ENV==='dev') console.log('The user with id: ',userId ,' is disconnected/connected: ',resp?.value)
                  if(typeof callback=='function') callback({
                    value:resp,
                    ...parent
                  })
                })
              }
            }
            return {
              ...parent
            }
          },
          device:{
            connected:(...args)=>{
              let parent=this.init(req)
              delete parent.auth().login
              delete parent.auth().register
              let userId,callback
              if(args.length===1){
                if(typeof args[0]=='string') userId=args[0]
                else if(typeof args[0]=='function') callback=args[0]
              }else if(args.length>=2) {
                const [id,cb,]=args
                if(typeof id=='string') userId=id
                callback=cb
              }
              let socketId=req?.socket?.auth?.id
              if(socketId){
                if(!userId){
                  let userInfo=JSON.parse(localStorage.getItem('userInfo')?localStorage.getItem('userInfo'):"{}")
                  if(userInfo.uid){
                    userId=userInfo.uid
                  }
                }
                if(userId && socketId){
                  req?.socket?.auth?.on(API_VERSION?.AUTH+listenRoute.user.device.connected,(resp)=>{
                    if(ENV==='dev') console.log('The user with id: ',userId ,' has this device connected: ',resp?.value)
                    if(typeof callback=='function') callback({
                      ...parent.auth().device,
                      ...parent,
                      value:resp
                    })
                  })
                }

              }
              return {
                ...parent.auth().device,
                ...parent
              }
            },
            disconnected:(...args)=>{
              let parent=this.init(req)
              delete parent.auth().login
              delete parent.auth().register
              let userId,callback
              if(args.length===1){
                if(typeof args[0]=='string') userId=args[0]
                else if(typeof args[0]=='function') callback=args[0]
              }else if(args.length>=2) {
                const [id,cb,]=args
                if(typeof id=='string') userId=id
                callback=cb
              }
              let socketId=req?.socket?.auth?.id
              if(socketId){
                if(!userId){
                  let userInfo=JSON.parse(localStorage.getItem('userInfo')?localStorage.getItem('userInfo'):"{}")
                  if(userInfo.uid){
                    userId=userInfo.uid
                  }
                }
                if(userId && socketId){
                  req?.socket?.auth?.on(API_VERSION?.AUTH+listenRoute.user.device.disconnected,(resp)=>{
                    if(ENV==='dev') console.log('The user with id: ',userId ,' has this device connected: ',resp?.value)
                    if(typeof callback=='function') callback({
                      ...parent.auth().device,
                      ...parent,
                      value:resp
                    })
                  })
                }

              }
              return {
                ...parent.auth().device,
                ...parent
              }
            },
            remove:(...args)=>{
              let parent=this.init(req)
              delete parent.auth().login
              delete parent.auth().register
              let userId,callback
              if(args.length===1){
                if(typeof args[0]=='string') userId=args[0]
                else if(typeof args[0]=='function') callback=args[0]
              }else if(args.length>=2) {
                const [id,cb,]=args
                if(typeof id=='string' || Array.isArray(id)) userId=id
                callback=cb
              }
              let socketId=req?.socket?.auth?.id
              let userInfo=JSON.parse(localStorage.getItem('userInfo')?localStorage.getItem('userInfo'):"{}")
              if(userId && userInfo.uid && socketId){
                req?.socket?.auth?.emit(API_VERSION?.AUTH+emitRoute.user.device.remove,{socketId,userId,currentUserId:userInfo.uid})
                req?.socket?.auth?.on(API_VERSION?.AUTH+listenRoute.user.device.removed,(resp)=>{
                  if(ENV==='dev') console.log('The user with id: ',userId ,' has this device connected: ',resp?.value)
                  if(typeof callback=='function') callback({
                    ...parent.auth().device,
                    ...parent,
                    value:resp
                  })
                })
              }
              return {
                ...parent.auth().device,
                ...parent
              }
            },
            list:(...args)=>{
              let parent=this.init(req)
              delete parent.auth().login
              delete parent.auth().register
              let path=emitRoute.users.device.list
              let userId,callback
              if(args.length===1){
                if(typeof args[0]=='string') userId=args[0]
                else if(typeof args[0]=='function') callback=args[0]
              }else if(args.length>=2) {
                const [id,cb,]=args
                if(typeof id=='string') {
                  userId=id
                  path=emitRoute.user.device.list
                }

                callback=cb
              }
              let socketId=req?.socket?.auth?.id
              let userInfo=JSON.parse(localStorage.getItem('userInfo')?localStorage.getItem('userInfo'):"{}")
              if(socketId && userInfo.uid){
                if(!userId){
                  path=emitRoute.user.device.list
                  userId=userInfo.uid
                }
                if(userId && socketId){
                  req?.socket.auth?.emit(API_VERSION?.AUTH+path,{socketId,userId,currenUserId:userInfo.uid})
                  req?.socket.auth?.on(API_VERSION?.AUTH+path+'/',(resp)=>{
                    if(ENV==='dev') console.log('The user with id: ',userId ,' has these devices connected: ',res?.value)
                    if(typeof callback=='function') callback({
                      ...parent.auth().device,
                      ...parent,
                      value:resp
                    })
                  })
                }

              }
              return {
                ...parent.auth().device,
                ...parent
              }

            }
          },
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
          $user:(()=>{
            let userInfo=JSON.parse(localStorage.getItem('userInfo')?localStorage.getItem('userInfo'):"{}")
            if(userInfo.uid){
              return userInfo
            }
            return undefined
          })(),
          user:(...args)=>{
            let uid,callback
            if(args.length>1){
              if(typeof args[0]=='string') uid=args[0]
              if(typeof args[1]=='function') callback=args[1]
            }else if(args.length===1){
              if(typeof args[0]=='string') uid=args[0]
              if(typeof args[0]=='function') callback=args[0]
            }
            let parent=this.init(req)
            delete parent.auth().login
            delete parent.auth().register
            let node={
              ...parent,
              ...parent.auth()
            }

            if(!uid || typeof uid !='string'){
              let userInfo=JSON.parse(localStorage.getItem('userInfo')?localStorage.getItem('userInfo'):"{}")
              let accessToken=localStorage.getItem('accessToken')
              let tokenIsNotExpired=(()=>{
                try {
                  let decoded=jwtDecode(accessToken)
                  return  Date?.parse(new Date(decoded?.exp*1000)?.toString())>Date.now()

                }catch (e) {
                  return false
                }
              })()
              //console.log('check if token expired: Date: ',tokenIsNotExpired)
              if(userInfo.uid && tokenIsNotExpired){
                if(typeof callback=='function'){
                  callback({
                    ...node,
                    value:userInfo
                  })
                }
                return {
                  ...node,
                  val:()=>userInfo
                }

              }else {

                return authRequest(authRoute.user,{},null,null,
                  ({value})=>{
                    let result=value
                    if(result?.data){
                      result={
                        data:result?.data?.data
                      }
                      if(result.data) localStorage.setItem('userInfo', JSON.stringify(result.data))
                    }
                    if(typeof callback=='function'){
                      callback({
                        ...node,
                        value:result
                      })
                    }
                  }
                )

              }
            }
            else {
              return authRequest(authRoute.user,{uid},null,null,
                ({value})=>{
                  let result=value
                  if(result?.data){
                    result={
                      data:result?.data?.data
                    }
                  }
                  if(typeof callback=='function'){
                    callback({
                      ...node,
                      value:result
                    })
                  }
                })

            }

          },
          verifyEmailCode:(data,callback)=>{
            let parent=this.init(req)
            delete parent.auth().login
            delete parent.auth().register
            return authRequest(authRoute.verify_email_code,data,null,null,
              ({value})=>{
                handleUserInfo({value,node:parent},callback)
              })
          },
          verifyTokenCode:(data,callback)=>{
            let parent=this.init(req)
            delete parent.auth().login
            delete parent.auth().register
            return authRequest(authRoute.verify_token_code,data,null,null,
              ({value})=>{
                handleUserInfo({value,node:parent},callback)
              })
          },
          verifyPassCode:(data,callback)=>{
            let parent=this.init(req)
            delete parent.auth().login
            delete parent.auth().register
            return authRequest(authRoute.verify_pass_code,data,null,null,
              ({value})=>{
                handleUserInfo({value,node:parent},callback)
              })
          },
          login:(data,callback)=>{
            let parent=this.init(req)
            delete parent.auth().login
            delete parent.auth().register
            return authRequest(authRoute.login,data,null,null,
            ({value})=>{
               handleUserInfo({value,node:parent},callback)
            })

          },
          loginWithToken:(token,callback)=>{
            let parent=this.init(req)
            delete parent.auth().login
            delete parent.auth().register
            localStorage.setItem('userInfo',"{}")
            localStorage.setItem('accessToken','')
            localStorage.setItem('refreshToken',token)
            return this.init(req).auth.user(null,callback)

          },
          logout:(callback)=>{
            let parent=this.init(req)
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('userInfo')
            localStorage.removeItem('accessToken')
            let handler=async ()=>{
              await this.#db?.ref('/database')?.remove()?.catch((e)=>{})
              await this.#db?.ref('/transaction')?.remove()?.catch((e)=>{})
            }
            handler().then(r =>{} ).catch(e=>{})
            if(typeof callback =='function'){
              callback({
                ...parent,
                ...parent.auth(),
              })
            }
            return {
              ...parent,
              ...parent.auth()
            }
          },
          register:(data,callback)=>{
            let parent=this.init(req)
            delete parent.auth().login
            delete parent.auth().register
            return authRequest(authRoute.register,data,null,null,({value})=>{
              handleUserInfo({value,node:parent},callback)
            })
          },
          forgotPassword:(data,callback)=> {
            return authRequest(authRoute.forgotPassword, data,null,null,callback)
          },
          users:()=>{
            let parent=this.init(req)
            delete parent.auth().login
            delete parent.auth().register
            return parent.ref('/users')
          },
          tokens:()=>{
            let parent=this.init(req)
            delete parent.auth().login
            delete parent.auth().register
            return parent.ref('/tokens')
          }
        }
      }

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
