import {io} from 'socket.io-client'

const SocketService = {
  init: ({API_KEY,HOST_SERVER,CURRENT,ENV,API_VERSION}) => {
    let socket={}
    const accessToken=localStorage.getItem('accessToken')
    try{
      const extraHeaders={
        'Accept':'application/json',
        'Content-Type':'application/json',
        'Access-Control-Allow-Origin':'*',
        'Access-Key':API_KEY,//API_KEY,
        //'socket':'"{privateClient:"true",id:"My-custom-id"}"',
        'Access-Control-Allow-Methods':'POST, GET, OPTIONS, PUT, DELETE, HEAD,PATCH',
        'Access-Control-Allow-Headers':'X-PINGOTHER, Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Max-Age':'1728000',
      }
      if(accessToken) extraHeaders['Authorization']='Bearer '+accessToken

      socket.auth = io(HOST_SERVER.AUTH,{
        extraHeaders
      });

      /*if(!socket.auth.connected){
        socket.auth.disconnect()
      }*/
      socket?.auth?.on('connect',()=>{
        //console.log('device is connected')
        /*io.on('/api/v1/socket-id',(data)=>{
          console.log('new device id ',data.id)
          io.id=data?.id
        })*/
        if(ENV==='dev') console.log('Swyger Auth Client JS is connected with Swyger Server!!!')
        let userInfo=JSON.parse(localStorage.getItem('userInfo')?localStorage.getItem('userInfo'):"{}")
        if(userInfo.uid){
          if(socket.auth?.id){
            if(ENV==='dev') console.log('The socket device id is: ',socket.auth?.id)
            socket?.auth?.emit(API_VERSION?.AUTH+'/user/join',{socketId:socket.auth?.id,currentUserId:userInfo.uid})
            socket?.auth?.on(API_VERSION?.AUTH+'/user/status',(resp)=>{
              if(userInfo.status!=='online'){
                let user
                if(resp.from===userInfo.uid) user=resp?.value
                if(user?.status){
                  if(ENV==='dev') console.log('user is online: ',user)
                  userInfo.status=user.status
                  localStorage.setItem('userInfo',JSON.stringify(userInfo))
                }
              }
            })

          }

        }

      })
      /*socket.auth.auth={
        //socket:{}
      }*/
      //if(!socket.auth.connected) socket.auth.disconnect()
      socket?.auth?.on("disconnect", (reason) => {
        //socket.auth.disconnect()
        if(ENV==='dev') console.log('The device is disconnected from Auth server!')
        let userInfo=JSON.parse(localStorage.getItem('userInfo')?localStorage.getItem('userInfo'):"{}")
        if(userInfo.uid){
          if(userInfo.status!=='offline'){
            userInfo.status='offline'
            localStorage.setItem('userInfo',JSON.stringify(userInfo))
          }

        }

        /*if (reason === "io server disconnect") {
          // the disconnection was initiated by the server, you need to reconnect manually
          io.connect();
        }*/
        // else the socket will automatically try to reconnect
      });


      return socket;
    }catch (e) {

    }

  },
};
export default SocketService
