import userService from '../../../../../../users/services/typeorm/users.service';
import {utils} from "../../../../../../../../helpers";
import sendMailMessage from "../../../../../../../../services/message/mail/swyger-mail";
import convertToMillis from 'ms'
import HTTP_RESPONSE_CODE from "../../../../../../../../helpers/all-http-response-code";
import {mode} from "../../../../../../../../config";

const authAdminToken=process.env.AUTH_ADMIN_TOKEN;
const forgotPassword = async (entities,data,args) => {
    const {extApi}=args
    let response={}
    let errors= []
    let error= {
        message: HTTP_RESPONSE_CODE.MESSAGE._400,
        code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
    }
    let model
    const expireIn=process.env.OPT_CODE_EXPIRATION
    const addedTime=convertToMillis(expireIn); //in millisecond so it will expires
    const readableTime=convertToMillis(addedTime,{long:true})

    const {email}=data
    const mUser = await userService.findOne(entities,{
        email
    });
    const user=mUser.data
    if (!user) {
        errors.push({
            msg:`User is not found with email: ${email}`
        })
    } else {
        user.isPassCodeVerified=false
        user.passwordCode = utils.randomVerfiedCode();
        user.passwordCodeExpires = Date.now() + addedTime

        const resp=await userService.updateOne(entities,Object.assign({},user));

        const text=`Hello ${user.email.replace(/@(.*)$/,'')},
                     you requested a code for forgotten password.
                     Here is the code : ${// @ts-ignore
                     user.passwordCode}. 
                     This code expires in ${readableTime}.
                     If you didn't make this request, please just ignore this mail.
                     Thanks for your concern.
                     Agglomy.
                     
                     Visit our page: https://agglomy.com`
        const html=`<div dir="ltr">
        Hello <b>${user.email.replace(/@(.*)$/,'')}</b>, <br>
        you requested a code for forgotten password.<br>
        Here is the code : <b style="font-size: x-large">${user.passwordCode}</b>.<br>
        This code expires in <b style="color: blue;font-size: larger">${readableTime}</b>.<br>
        If you did not make this request, please just ignore this mail.<br>
        Thanks for your concern.<br>
        <b>Agglomy.</b> <br>
        <br>
        Visit our website: <b><a href="https://agglomy.com">agglomy.com</a></b>
        </div>`
        let data={
            from:process.env.NO_REPLY_EMAIL,
            to:user.email,
            subject:'Reset password code for '+user.email,
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
            console.log('Mail sent for Forgot Password: ',data)
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
    if(mUser.error){
        if(mUser.error.errors){
            response.error.errors=[...response.error.errors,mUser.error.errors]
        }
        if(mUser.error.node){
            response.error.message=HTTP_RESPONSE_CODE.MESSAGE._500
            response.error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
            response.error.node= {msg:'Internal error with server to /send-forgot-password'}
        }
    }

    return response
};

export default forgotPassword
