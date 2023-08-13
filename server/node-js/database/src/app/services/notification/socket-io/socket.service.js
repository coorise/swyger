import { Server } from "socket.io";
import jwt from '../../auth/jwt/jwt';
import socketWildcard from 'socketio-wildcard'

const rootApi = process.env.API_PATH ||'/api/v1';

// for more info: https://github.com/ping58972/node-rest-api-basic-socket-io
let io;

const init= (httpServer,appModule) => {
  // eslint-disable-next-line global-require
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
    console.log('database socket, new device id is:  ', socket.id)
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
          socket.on('*',async (event)=>{
            //console.log('use a wildcard: ', event)
            if(Array.isArray(event.data))
              if(typeof event.data?.[0]=='string' && event.data?.[0].charAt(0)==='%'){
                //socket.broadcast.emit(...event?.data)
                if(event.data?.[1])
                  appModule.publicSocket.emit(...event?.data)
              }

          })
          socket.on(rootApi+'/user-id',async (data)=>{
            //console.log('getting data ', data)
            try {
              let token=socket.handshake.headers?.authorization?.replace('Bearer ','')
              if(await jwt.verify(token))
                if(socket?.id && data?.socketId && data?.userId) {
                  appModule.socketList[data?.socketId] = data?.userId
                  if(typeof appModule.userSocketList[data?.userId]=='object'){
                    appModule.userSocketList[data?.userId][data?.socketId]=data?.socketId
                  }else {
                    appModule.userSocketList[data?.userId] = {[data?.socketId]:data?.socketId}
                    console.log('New user connected:  ',data?.userId)
                  }
                  console.log('New device from user connected:  ',data?.socketId)
                }
            }catch (e) {

            }
          })
          socket.on('disconnect',()=>{
            if(socket?.id){
              try {
                delete appModule.userSocketList[appModule?.socketList[socket?.id]][socket?.id]
                if(Object.keys(appModule.userSocketList[appModule.socketList[socket?.id]]).length<=1){
                  console.log('Disconnected last device: ', socket?.id, ' from user: ',appModule.socketList[socket?.id])
                  delete appModule.userSocketList[appModule.socketList[socket?.id]]
                }
                delete appModule.socketList[socket?.id]
              }catch (e) {

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
