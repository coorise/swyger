import userService from '../../../../../../users/services/typeorm/users.service';
import HTTP_RESPONSE_CODE from "../../../../../../../../helpers/all-http-response-code";
import ALL_AUTH_CODE from "../../../../../../../../helpers/all-auth-code";
const verifyEmailCode = async (entities,data) => {

    let response={}
    let errors= []
    let error= {
        message: HTTP_RESPONSE_CODE.MESSAGE._400,
        code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
    }
    let model
    let mUser

    const { emailCode, email } = data;
    mUser = await userService.findOne(entities,{
        email
    })
    if(!mUser?.data){
        error=ALL_AUTH_CODE["600"]
        errors.push({
            msg:'This email doesn\'t exist: '+email
        })
    }
    else if(emailCode===0){
        error=ALL_AUTH_CODE["605"]
        errors.push({
            msg:'Code is not invalid: '+emailCode
        })
    }else {
        mUser = await userService.findOne(entities,{
            email,
            emailCode:parseInt(emailCode)
        });
        const user=mUser.data
        if (!user) {
            error=ALL_AUTH_CODE["605"]
            errors.push({
                msg:'Code is not invalid: '+emailCode
            })
        }
        else {
            if(user.isEmailVerified){
                let data=user
                delete data.password
                delete data.resetPasswordToken;
                delete data.resetPasswordExpires;
                delete data.temporaryPassword;
                delete  data.verifyPassword
                delete  data.extras
                delete data.emailCode
                delete data.phoneCode
                delete data.passwordCode
                delete data.emailCodeExpires
                delete data.passwordCodeExpires
                delete data.phoneCodeExpires
                model={data}
            }
            else
            if(user.emailCodeExpires>Date.now()){
                user.emailCode = 0;
                user.emailCodeExpires = 0;
                user.isEmailVerified=true
                mUser=await userService.updateOne(entities,Object.assign({},user));
                let data=mUser.data
                delete data.password
                delete data.resetPasswordToken;
                delete data.resetPasswordExpires;
                delete data.temporaryPassword;
                delete  data.verifyPassword
                delete  data.extras
                delete data.emailCode
                delete data.phoneCode
                delete data.passwordCode
                delete data.emailCodeExpires
                delete data.passwordCodeExpires
                delete data.phoneCodeExpires
                model={data}
            }else {
                error=ALL_AUTH_CODE["606"]
                errors.push({
                    msg:'Code is already expired: '+emailCode
                })
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
            response.error.node= {msg:'Internal error with server to /verify-email-code'}
        }
    }
    return response
};
export default verifyEmailCode
