import userService from '../../../../../../users/services/typeorm/users.service';
import {utils} from "../../../../../../../../helpers";
import sendMailMessage from "../../../../../../../../services/message/mail/swyger-mail";
import convertToMillis from 'ms'
import HTTP_RESPONSE_CODE from "../../../../../../../../helpers/all-http-response-code";
import {mode} from "../../../../../../../../config";
const authAdminToken=process.env.AUTH_ADMIN_TOKEN;
const sendEmailVerification = async (entities,data,args) => {
    const {extApi}=args
    let response={}
    let errors= []
    let error= {
        message: HTTP_RESPONSE_CODE.MESSAGE._400,
        code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
        errors: []
    }
    let model
    const expireIn=process.env.OPT_CODE_EXPIRATION
    const addedTime=convertToMillis(expireIn); //in millisecond so it will expires
    const readableTime=convertToMillis(addedTime,{long:true})
    const {email}=data
    const mUser = await userService.findOne(entities,{
        email
    });
    let user=mUser.data
    if (!user) {
        errors.push({msg:`User not found with data: ${email}`})
    } else {
        user.isEmailVerified=false
        user.emailCode = utils.randomVerfiedCode();
        // @ts-ignore
        user.emailCodeExpires = Date.now() + addedTime

        await userService.updateOne(entities,user);
        const text=`Hello ${user.email.replace(/@(.*)$/,'')},
        you requested an email verification code.
        Here is the code : ${user.emailCode}.
        This code expires in ${readableTime}.
        If you did not make this request, please just ignore this mail.
        Thanks for your concern.
        Agglomy.
        
        Visit our page: https://agglomy.com`
        const html=`<div dir="ltr">
        Hello <b>${user.email.replace(/@(.*)$/,'')}</b>, <br>
        you requested an email verification code.<br>
        Here is the code : <b style="font-size: x-large">${user.emailCode}</b>.<br>
        This code expires in <b style="color: blue;font-size: larger">${readableTime}</b>.<br>
        If you did not make this request, please just ignore this mail.<br>
        Thanks for your concern.<br>
        <b>Agglomy.</b> <br>
        <br>
        Visit our website: <b><a href="https://agglomy.com">agglomy.com</a></b>
        </div>`
        /*const contentType=`multipart/mixed; boundary="boundaryMixed"

--boundaryMixed
Content-Type:multipart/alternative; boundary="boundaryAlternative"

--boundaryAlternative
Content-Type: text/plain; charset="utf-8"
Content-Transfer-Encoding: quoted-printable
Content-Disposition: inline

${text}

--boundaryAlternative
Content-Type: text/html; charset="utf-8"
Content-Transfer-Encoding: quoted-printable
Content-Disposition: inline

${html}

--boundaryAlternative--

--boundaryMixed--`*/
        let data={
            from:process.env.NO_REPLY_EMAIL,
            // @ts-ignore
            to:user.email,
            // @ts-ignore
            subject:'Email Verification Code for '+user.email,
            text:text,
            html:html
        }
        const mailService =await sendMailMessage(
            {
                url:extApi.url,
                data:{
                    data
                },
                headers: {
                    //"Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${extApi.token}`,
                    "Access-Key":authAdminToken,
                }
            }
        )
        if(mode==='development'){
            console.log('Mail sent for new user verification: ',data)
        }
        if(mailService.error){
            errors=[...errors,...mailService.error?.errors]
        }else {
            model= {
                message:`A mail was sent to ${user.email}`
            }
        }
    }
    response.data=model
    if(errors.length>0){
        response.error=error
        response.error.errors=errors
    }
    if(mUser.error){
        if(mUser.error.errors){
            response.error.errors=[...response.error.errors,mUser.error.errors]
        }
        if(mUser.error.node){
            response.error.message=HTTP_RESPONSE_CODE.MESSAGE._500
            response.error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
            response.error.node= {msg:'Internal error with server to /send-email-verification'}
        }
    }

    return response
};

export default sendEmailVerification
