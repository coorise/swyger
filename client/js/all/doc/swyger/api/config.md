# Swyger Client Config
## Setup
```
//Setup your socket io client from swyger library
const socket= io(HOST_SERVER.DATABASE,{
        extraHeaders
      })
//Setup your axios client from swyger library
const config=Object.assign(
    {
      mode:'cors',
      method,
      url,
      data,
      headers,
    },
    args
  )
const axios=(config)=>{
   let resp={}
  try {
    const result  =await axios(config)
    resp.data=result?.data?.data || result?.data
    if(!resp.data) resp.data={}
  }catch (e) {
    resp.error=e.response?.data?.error || e.response?.error
    if(!resp.error) resp.error={}
  }

  return resp
}

//Setup the Req for socket and the Swyger library
let req={
   socket
}
let SwygerClient= RemoteService.init(config)
let client=SwygerClient.init(config)
//Now you have the api done!
  client
       .auth
       .database
       .storage
       ...etc

```
## Init Swyger on realtime
```
client?.ready(async ()=>{ // .ready() for  .on('connect',cb) from socket.io client
   //your operation
   //eg: client.database.create({},callback)
})
```
