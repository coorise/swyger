import userService from '../../../../../../users/services/typeorm/users.service';
import sendPhoneMessage from "../../../../../../../../services/message/phone/swyger-phone";
import HTTP_RESPONSE_CODE from "../../../../../../../../helpers/all-http-response-code";

const verifyPhoneCode = async (entities,data,args) => {

    let response={}
    const {extApi}=args
    let errors= []
    let error= {
        message: HTTP_RESPONSE_CODE.MESSAGE._400,
        code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
    }
    let model

    const { phoneCode, email,numberPhone } = data;

    const mUser = await userService.findOne(entities,{
        email,
        //phoneCode,
        numberPhone
    });
    const user=mUser.data


    if (!user) {
        errors.push({
            msg:`User not found with data: phone ${numberPhone} ,  and email ${email}`
        })
    } else {
        /*if(user.phoneCodeExpires>Date.now()){
            user.phoneCode = 0;
            user.phoneCodeExpires = 0;
            user.isPhoneVerified=true
            model=await userService.updateOne(entities,user);
            model= true;
        }else {
            error.errors.push('Code is already expired: '+phoneCode)
        }*/
        const phoneService =await sendPhoneMessage(
            {
                url:extApi.url,
                data:{
                    //from:'',
                    to:user.numberPhone,
                    code:phoneCode
                },
                headers: {
                    //"Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${extApi.token}`
                }
            }
        )
        if(phoneService.error){
            delete phoneService.error?.errors
            errors.push({
                msg:`User not found with data: phone ${numberPhone} , code ${phoneCode}  and email ${email}`
            })
        }else {
            const mailExt=process.env.MAIL_EXT
            const reg=new RegExp(`${mailExt}$`)
            if(reg.test(user.email)){
                user.isEmailVerified=true
            }
            user.phoneCode = 0;

            user.phoneCodeExpires = 0;

            user.isPhoneVerified=true

            await userService.updateOne(entities,user);

            model={
                message:`Thanks for verification : ${user.numberPhone}`
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
            response.error.node= {msg:'Internal error with server to /verify-phone-code'}
        }
    }

    return response
};
export default verifyPhoneCode
