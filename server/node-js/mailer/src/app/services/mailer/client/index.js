import MailComposer from 'nodemailer/lib/mail-composer'
import nodemailer from 'nodemailer'


//visit https://nodemailer.com/extras/mailcomposer/#attachments
const mailComposer=async (data)=>{
    const mail=new MailComposer(data)
    /*data={
        //greetingTimeout : 1000*10,
        from: 'team@agglomy.com', // sender address
        to: ['someone@locahost:2600', ' mipijiv332@ploneix.com'], // list of receivers
        subject: "Hello Test ", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
        headers:{
            authorization:'Basic tytytytyty:jjkjkkkjk'
        }
    }
    */
    return new Promise((resolve)=>{
        mail.compile().build((err,message)=>{
            resolve(message.toString())
        })

    })
}
const NodeMailerClient={
    send:(data,config)=>{

        let transporter = nodemailer.createTransport(config);
        return new Promise(resolve=>{
            transporter.sendMail(data, function(error, info){
                let response={}
                if (error) {
                    //console.log('response code:',error.responseCode);
                    //console.log('message ',error.response);
                    //console.log('the sender was rejected by emails:',error.rejected);
                    response={
                        error:{
                            code:error?.responseCode,
                            message:error?.response
                        }
                    }
                    if(error?.rejected?.length){
                        response.error.rejectedBy=info?.rejected
                    }

                } else {
                    //console.log('Email sent: ' + info.response);
                    //console.log('Email sent: ' + info.accepted);
                    response={
                        data:{
                            message:info?.response,
                            acceptedBy:info?.accepted
                        }
                    }
                    if(info?.rejected?.length){
                        response.data.rejectedBy=info?.rejected
                    }

                }
                resolve(response)
            });
        })


    }
}
export {
    mailComposer,
    NodeMailerClient
}
