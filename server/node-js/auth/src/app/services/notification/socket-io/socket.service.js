import { Server } from "socket.io";
import {jwt} from "../../../services";
import socketWildcard from 'socketio-wildcard'
import userService from "../../../rest/core/users/services/typeorm/users.service";

const rootApi = process.env.API_PATH ||'/api/v1';

// for more info: https://github.com/ping58972/node-rest-api-basic-socket-io
let io;
const init= (httpServer,appModule) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE'],

    }
  });

  appModule.verify = false
  appModule.publicSocket = io
  /*io.use((socket,next)=>{
    io.engine?.generatedId=()=>{
      if(socket?.handshake.auth?.id){
        return socket?.handshake.auth.id
      }
    }
    next(null,true)
  })*/

  //io.use(appModule.socketRouter.handle())
  appModule.publicSocket.use(socketWildcard())

  appModule.publicSocket.use(appModule.socketRouter.handle())
  appModule.publicSocket.on('connection', async (socket)=>{
    //socket.emit('/api/v1/socket-id',{id:socket.id})
    //console.log('socket ', socket)
    if(!socket.handshake.headers['access-key']){
      console.log('No access key found on socket id ',socket.id)
      //socket.send({code:401,message:'No access key found'})
      socket.disconnect(true)
    } else {
      const accessKey=socket.handshake.headers['access-key']
      try {
        if(!await jwt.verify(accessKey)){
          console.log('The access key is not valid ',socket.id)
          //socket.send({code:401,message:'No access key found'})
          socket.disconnect(true)
        }else {
          appModule.privateSocket = socket
          let verify=async ()=>{
            try{
              let token=socket.handshake.headers?.authorization?.replace('Bearer ','')
              return await jwt.verify(token)
            }catch (e) {
              return false
            }
          }
          verify=await verify()

          socket.on('*',async (event)=>{
            //console.log('use a wildcard: ', event)
            if(Array.isArray(event.data))
              if(typeof event.data?.[0]=='string' && event.data?.[0].charAt(0)==='%'){
                //socket.broadcast.emit(...event?.data)
                if(event.data?.[1])
                appModule.publicSocket.emit(...event?.data)
              }

          })

          socket.on(rootApi+'/users/device-list',async (data)=>{
            //console.log('get header infos: ',socket.handshake.headers)
            let userInfo
            try {
              if(verify)
                if(socket?.id && data?.currentUserId){
                  userInfo = await userService.findOne(appModule.entitySchema,{
                    uid: data?.currentUserId
                  });
                  if(userInfo.data){
                    let deviceList= appModule.deviceList
                    if(deviceList){
                      appModule.publicSocket.emit(rootApi+'/users/device-list/',{
                        from:data?.currentUserId,
                        value:deviceList
                      })
                    }
                  }
                }

            }catch (e) {

            }
          })
          socket.on(rootApi+'/user/device-list',async (data)=>{
            //console.log('get header infos: ',socket.handshake.headers)
            let userInfo
            try {
              if(verify)
                if(socket?.id &&  data?.currentUserId && data?.userId){
                  userInfo = await userService.findOne(appModule.entitySchema,{
                    uid: data?.currentUserId
                  });
                  if(userInfo.data){
                    let deviceList= appModule.deviceList[data?.userId]
                    if(deviceList){
                      appModule.publicSocket.emit(rootApi+'/user/device-list/',{
                        from:data?.currentUserId,
                        value:deviceList
                      })
                    }
                  }
                }

            }catch (e) {

            }
          })
          socket.on(rootApi+'/user/device-remove',async (data)=>{
            let userInfo
            try {
              if(verify)
                if(socket?.id && data?.socketId  && data?.currentUserId && data?.userId){
                  userInfo = await userService.findOne(appModule.entitySchema,{
                    uid: data?.currentUserId
                  });
                  if(userInfo.data){
                    let list=[]
                    if(typeof data?.userId=='string'){
                      list.push(data.userId)
                    }else if(Array.isArray(data.userId)){
                      list=data.userId
                    }
                    for(let userId of list){
                      let deviceList=appModule.deviceList[data?.userId]
                      if(deviceList){
                        if(typeof userId=='string'){
                          let device=deviceList[data?.socketId]
                          appModule.publicSocket.sockets.sockets[data?.socketId].disconnect()
                          appModule.publicSocket.emit(rootApi+'/user/device-removed',{
                            from:data?.currentUserId,
                            value:device
                          })
                        }
                      }
                    }

                  }
                }


            }catch (e) {

            }

          })
          socket.on(rootApi+'/user/join',async (data)=>{
            //console.log('getting data ', data)
            try {
              if(verify){
                if(socket?.id && data?.socketId && data?.currentUserId) {
                  let userInfo
                  let headers=socket.handshake.headers
                  let device={
                    host:headers.origin,
                    'user-agent':headers['user-agent'],
                    'sec-ch-ua':headers['sec-ch-ua'],
                    socketId:data?.socketId,
                    'sec-ch-ua-mobile':headers['sec-ch-ua-mobile'],
                    'sec-ch-ua-platform':headers['sec-ch-ua-platform'],
                    'accept-language':headers['accept-language'],

                  }
                  userInfo = await userService.findOne(appModule.entitySchema,{
                    uid: data?.currentUserId
                  });
                  if(userInfo.data){
                    appModule.socketList[data?.socketId] = data?.currentUserId
                    appModule.deviceList[data?.currentUserId]={
                      ...appModule.deviceList[data?.currentUserId],
                      [data?.socketId]:device
                    }
                    if(typeof appModule?.userSocketList?.[data?.currentUserId]=='object'){
                      appModule.userSocketList[data?.currentUserId][data?.socketId]=data?.socketId
                    }
                    else {
                      appModule.userSocketList[data?.currentUserId] = {[data?.socketId]:data?.socketId}
                      await userService.updateOne(appModule.entitySchema,{
                        uid: data?.currentUserId,
                        status:'online'
                      });
                      console.log('                <<<<<<<<Socket User Connected>>>>>>>>>  ')
                      console.log('New User connected:  ',data?.currentUserId)
                      appModule.publicSocket.emit(rootApi+'/user/status',{
                        from:data?.currentUserId,
                        value:{
                          uid: data?.currentUserId,
                          status:'online'
                        }
                      })
                    }
                    appModule.publicSocket.emit(rootApi+'/user/device-connected',{
                      from:data?.currentUserId,
                      value:device
                    })

                    console.log('             {{{{{{-----Device Connected----}}}}}}}}  ')
                    console.log('New device connected: ',data?.socketId,' from user:  ',data?.currentUserId)
                    console.log('----------------------------------------------------')
                  }


                }
              }

            }catch (e) {
              console.log('on user-id error: ', e)
            }
          })
          socket.on('disconnect',async () => {
            if (socket?.id) {
              try {
                let userInfo = await userService.findOne(appModule?.entitySchema, {
                  uid: appModule?.socketList[socket?.id]
                });
                let userId=appModule?.socketList[socket?.id]
                let device=appModule?.deviceList[userId][socket?.id]
                if(userInfo.data && device){
                  delete appModule?.deviceList[userId]?.[socket?.id]
                  if (Object.keys(appModule.userSocketList[userId]).length === 1) {
                    if(userInfo.data){
                      await userService.updateOne(appModule?.entitySchema, {
                        uid: appModule.socketList[socket?.id],
                        status:'offline'
                      })
                      console.log('                //////////Socket User Disconnected\\\\\\\\\\\\  ')
                      console.log('User Disconnected:  ',userId)
                      appModule.publicSocket.emit(rootApi+'/user/status',{
                        from:userId,
                        value:{
                          uid: userInfo.data.uid,
                          status:'offline'
                        }
                      })

                      console.log('             @@@@@-----Device Disconnected----@@@@@  ')
                      console.log('Disconnected last active device: ', socket?.id, ' from user: ', userId)
                      console.log('----------------------------------------------------')

                    }
                    delete appModule?.userSocketList[userId]
                  }else {
                    delete appModule?.userSocketList[userId]?.[socket?.id]
                  }
                  delete appModule?.socketList[socket?.id]
                  appModule.publicSocket.emit(rootApi+'/user/device-disconnected',{
                    from:userId,
                    value:device
                  })
                  console.log('             -----Device Disconnected----  ')
                  console.log('Device connected: ',socket.id,' from user:  ',userId)
                  console.log('----------------------------------------------------')
                }

              } catch (e) {

              }

            }
          })
        }
      }catch (e) {

      }


    }

  })

  return appModule.publicSocket;
};

export {
  init,
};
