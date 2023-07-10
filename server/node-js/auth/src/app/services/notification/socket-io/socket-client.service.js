import io from 'socket.io-client'

let mIo;
export const mSocket = {
  init: (appModule) => {
    // eslint-disable-next-line global-require
    try{
      mIo = io(appModule.daynverServerUrl,{
        extraHeaders: {
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': "Bearer "+appModule.authAdminToken,
          'Access-Control-Allow-Origin':'*',
          'Access-Control-Allow-Methods':'POST, GET, OPTIONS, PUT, DELETE, HEAD,PATCH',
          'Access-Control-Allow-Headers':'X-PINGOTHER, Origin, X-Requested-With, Content-Type, Accept',
          'Access-Control-Max-Age':'1728000',
        }
      });
      mIo.on('database_server_url',(data)=>{
        console.log('----------->');
        console.log('database_server_url: ',data);
        appModule.databaseServerUrl = data;
      })
      mIo.on('daynver_server_url',(data)=>{
        console.log('----------->');
        console.log('daynver_server_url: ',data);
        appModule.daynverServerUrl = data;
      })

      mIo.on('mail_server_url',(data)=>{
        console.log('----------->');
        console.log('mail_server_url: ',data);
        appModule.mailServerUrl = data;
      })

      mIo.on('phone_server_url',(data)=>{
        console.log('----------->');
        console.log('phone_server_url: ',data);
        appModule.phoneServerUrl = data;
      })

      mIo.on('storage_server_url',(data)=>{
        console.log('----------->');
        console.log('storage_server_url: ',data);
        appModule.storageServerUrl = data;
      })
      mIo.on('cron_server_url',(data)=>{
        console.log('----------->');
        console.log('cron_server_url: ',data);
        appModule.cronServerUrl = data;
      })

      mIo.on('auth_server_url',(data)=>{
        console.log('----------->');
        console.log('auth_server_url: ',data);
      })


      const send_update_url=process.env.SEND_UPDATE_URL_ON_START || 'true'
      mIo.on('connect',()=>{
        if(send_update_url==='true'){
          console.log('auto_send_auth_server_url: ',appModule.authServerUrl);
          mIo.emit('send_auth_server_url',appModule.authServerUrl)
          console.log('-------------------Api url List------------------')
        }
      })
      return mIo;
    }catch (e) {

    }

  },
  getIO: () => {
    try{
      if (!mIo) {
        console.log('Socket client is not initialised');
      }
      return mIo;
    }catch (e) {

    }


  },
};