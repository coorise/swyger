import parseMail from "../../../helpers/parse-mail";
const manageMail=(message)=>{
    const detail=parseMail(message)
    /*console.log('---------Incoming Message-------')
    console.log('From:', detail.from)
    console.log('To:', detail.to)
    console.log('Subject:', detail.subject)
    console.log('Body:', detail.html)
    console.log('Attachment:' , detail.attachments)
    console.log('----End Incoming Message-------')*/
}
export default manageMail