## Event
here is an example of how to use event and with the chainable way:
```
    let messageFrom=[]
    let myMessage=[]
    let event=client
    .auth//.database//.storage
    ?.event('parent')
    
    event
    .emit('emit parent').do(parentSnap=>{
      console.log('parent do: ',parentSnap?.value)
    })
    .child('child')
    .emit({
      from:client.auth?.$currentSocket.id,
      message:'emit sub-child: '
    })
    .do(childSnap=>{
      console.log('child do: ',childSnap?.value?.message)
      //console.log('current socket: ',client.auth?.$currentSocket.id)
      childSnap
      .child('subChild')
      .emit({
        from:client.auth?.$currentSocket.id,
        messageId:client.$randomUID,
        message:'emit sub-child: '
      })
      .do((res)=>{
        if(res.value?.from!==client.auth?.$currentSocket.id){
          let messageExist=messageFrom.filter((item)=>item?.messageId===res.value?.messageId)
          //console.log('messageFrom exists: ',messageExist)
          if(messageExist.length===0){
            messageFrom.push(res.value)
            console.log('from: ',res?.value.message)
          }
        }
        else {
          let messageExist=myMessage.filter((item)=>item?.messageId===res.value?.messageId)
          if(messageExist.length===0){
            myMessage.push(res.value)
            console.log('you: ',res?.value.message)
          }
        }
      })
    })
```
