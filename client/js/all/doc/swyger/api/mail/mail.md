# Mail (Soon)
## Mail Setting Example
```
const mail=client.mail?.mail(config)
```
### Storage Listener Example
```
//Listen mail
mail
      .on()
      .send(({value})=>{ //Only send function available
         console.log('mail : ',value)
       })
```
### Send Mail Example
```
//Upload Single File
const blob = new Blob(["This is a sample file content."], {
      type: "text/plain;charset=utf-8",
    })
mail
      .send({
          from:'from-user@swyger.com',
          to:['to-user1@swyger.com','to-user2@swyger.com',...],
          cc:[],
          bcc:[],
          subject:'About Swyger',
          text:'We love Swyger!',
          html:'<b> We love Swyger! </b>',
          attachments:[
             blob || file:{data:blob, name]
          ]
       },({value})=>{
         console.log('mail : ',value)
       })
```
