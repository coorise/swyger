## Devices
Here you will see an example to manage devices connected with users authenticated:
```
    let devices=[]
    client.auth?.auth().device
      .connected((device)=>{
      if(device?.value?.from===client.auth?.$currentUserId){
        let deviceExist=devices.filter((item)=>item?.value?.socketId===device?.value?.value?.socketId)
        console.log('device received: ',client.auth?.$currentUserId)
        //console.log('device exist: ',deviceExist)
        if(deviceExist.length===0){
          //console.log('A new device is connected: ',device)
          devices.push(device.value)
        }
        console.log('Total devices connected : ',devices)
      }


    })
      .disconnected((device)=>{
      if(device?.value?.from===client.auth?.$currentUserId){
        let deviceExist=devices.filter((item)=>item?.value?.socketId===device?.value?.value?.socketId)
        console.log('We got disconnected device: ',deviceExist)
        if(deviceExist.length>0){
          devices=devices.splice(devices.indexOf(device.value),1)
        }
        console.log('Total devices connected: ',devices)
      }


    })
```
