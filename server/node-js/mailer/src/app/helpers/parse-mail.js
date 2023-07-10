const parseMail=(message)=>{
    //This is what is generated from mime2 module
    //Response from incoming
    /*
      Incoming Message: {
      hostname: 'agglomy.com',
      from: {
        host: 'agglomy.com',
        user: 'team',
        name: '',
        address: 'team@agglomy.com',
        toString: [Function: toString]
      },
      recipients: [
        {
          host: 'mail.192.168.1.14.nip.io:26',
          user: 'vidami9213',
          name: '',
          address: 'vidami9213@mail.192.168.1.14.nip.io:26',
          toString: [Function: toString]
        }
      ],
      content: {
        headers: [ [Header], [Header], [Header] ],
        body: '\r\n' +
          'This is an example of mail sending to you.Thank for joining us!!!\r\n' +
          '\r\n' +
          '\r\n' +
          '.\r\n'
      }
     }

    */

    let detail,to,from,subject,body
    from=message.content.headers.filter(header=>header.name==='from')
    from=from[0].value
    to=message.content.headers.filter(header=>header.name==='to')
    to=to[0].value
    if(to.split(',').length>0){
        to=to.split(',')
    }
    subject=message.content.headers.filter(header=>header.name==='subject')
    subject=subject[0].value
    if(from && to && subject){
        let html,text,attachments,headers,files
        body=message.content.body.filter(body=>body.headers?.length<=1&&body.headers.filter(header=>header.value==='multipart/alternative'))
        files=message.content.body.filter(body=>body.headers?.length>1&&body.headers.filter(header=>header.value!=='multipart/alternative'))

        let i =0
        if(files.length>0){
            attachments=[]
            for (let file of files){
                let type, filename,buffer
                type=file.headers.filter(header=>header.name==='Content-Type')
                if(type[0]){
                    //console.log('type value ', type)
                    type=type[0].value
                    filename=file.headers.filter(header=>header.name==='Content-Disposition')
                    if(filename[0].options?.filename){
                        filename=filename[0].options.filename
                    }else {
                        filename='no-name'+i
                    }
                    buffer=file.body
                }
                attachments.push({
                    filename,
                    type,
                    buffer
                })
            }
        }
        if(body.length>=1){
            body=body[1]
            html=body.body[1].body
        }

        return {
            from,
            to,
            subject,
            html,
            attachments
        }
    }
    return false
}
export default parseMail