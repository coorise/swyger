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

      socket.storage = io(HOST_SERVER?.STORAGE,{
        extraHeaders
      });

      //if(!socket?.storage?.connected) socket?.storage?.disconnect()
      socket?.storage?.on('connect',()=>{
        if(ENV==='dev') console.log('Swyger Storage Client JS is connected with Swyger Server!!!')

      })
      if(!socket?.storage) socket?.storage?.disconnect()
      socket?.storage?.on("disconnect", (reason) => {
        if(ENV==='dev') console.log('The device is disconnected from Storage server!')

        //socket?.storage?.disconnect()
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
