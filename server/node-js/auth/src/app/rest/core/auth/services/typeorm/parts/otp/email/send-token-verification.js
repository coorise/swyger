import refreshTokenService from '../../../../../../refresh_tokens/services/typeorm/refresh_tokens.service'
import {utils} from "../../../../../../../../helpers";
import sendMailMessage from "../../../../../../../../services/message/mail/swyger-mail";
import Dayjs from "dayjs";
import convertToMillis from "ms";
import HTTP_RESPONSE_CODE from "../../../../../../../../helpers/all-http-response-code";
import {mode} from "../../../../../../../../config";

const authAdminToken=process.env.AUTH_ADMIN_TOKEN;
const sendTokenVerification = async (entities,data,option,refreshToken) => {

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


    let user=data
    let mRefreshToken
    if (!user) {
        errors.push({
            msg:`User not found with data: ${data.email}`
        })
    } else {
        refreshToken.isTokenVerified=false
        refreshToken.tokenCode = utils.randomVerfiedCode();
        refreshToken.tokenCodeExpires = Date.now() + addedTime

        mRefreshToken=await refreshTokenService.updateOne(entities,refreshToken);

        const text=`Hello ${user.email.replace(/@(.*)$/,'')},
                     We need to check if you are trying to connect in another device.
                     For your safety, please type this verification code in the second device.
                     Here is the code : ${refreshToken.tokenCode}. 
                     This code expires in ${readableTime}.
                     Here you will find details for the unknown device:
                     -This device tried to connect :
                       ${Dayjs(new Date()).format('YYYY-MM-DD HH:ss')}
                     -For the geolocation:
                       ${JSON.stringify(option.geoIp)}
                     -For Device info:
                       ${JSON.stringify(option.user_agent)}.
                      
                     If you didn't make this request, please just ignore this mail.
                     Thanks for your concern.
                     Agglomy.
                     
                     Visit our page: https://agglomy.com`
        const html=`<div dir="ltr">
        Hello <b>${user.email.replace(/@(.*)$/,'')}</b>, <br>
        We need to check if you are trying to connect in another device.<br>
        Here is the code : <b style="font-size: x-large">${refreshToken.tokenCode}</b>.<br>
        This code expires in <b style="color: blue;font-size: larger">${readableTime}</b>.<br>
        
        Here you will find details for the unknown device:<br>
         -This device tried to connect :<br>
           ${Dayjs(new Date()).format('YYYY-MM-DD HH:ss')}<br>
         -For the geolocation:<br>
           ${JSON.stringify(option.geoIp)}<br>
         -For Device info:<br>
           ${JSON.stringify(option.user_agent)}.<br>
        
        If you did not make this request, please just ignore this mail.<br>
        Thanks for your concern.<br>
        <b>Agglomy.</b> <br>
        <br>
        Visit our website: <b><a href="https://agglomy.com">agglomy.com</a></b>
        </div>`
        let data={
            from:process.env.NO_REPLY_EMAIL,
            to:user.email,
            subject:'New device token & verification for '+user.email,
            text:text,
            html:html
        }
        const mailService =await sendMailMessage(
            {
                url:option.url,
                data:{
                    data
                },
                headers: {
                    //"Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${option.token}`,
                    "Access-Key":authAdminToken,
                }
            }
        )
        if(mode==='development'){
            console.log('Mail sent for new device verification: ',data)
        }
        if(mailService.error){
            errors=[...errors,...mailService.error?.errors]
        }else {
            model={
                message:`A mail was sent to ${user.email}`
            }
        }
    }
    response.data=model
    if(errors.length>0){
        response.error=error
        response.error.errors=errors
    }
    if(mRefreshToken.error){
        if(mRefreshToken.error.errors){
            response.error.errors=[...response.error.errors,mRefreshToken.error.errors]
        }
        if(mRefreshToken.error.node){
            response.error.message=HTTP_RESPONSE_CODE.MESSAGE._500
            response.error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
            response.error.node= {msg:'Internal error with server to /send-token-verification'}
        }
    }

    return response
};

export default sendTokenVerification
