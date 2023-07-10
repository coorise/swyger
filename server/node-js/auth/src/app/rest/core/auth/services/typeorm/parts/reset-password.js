import userService from '../../../../users/services/typeorm/users.service';
import bcrypt from "bcryptjs";
import HTTP_RESPONSE_CODE from "../../../../../../helpers/all-http-response-code";
import ALL_AUTH_CODE from "../../../../../../helpers/all-auth-code";

const resetPassword = async (entities,user) => {

    let response={}
    let errors= []
    let error= {
        message: HTTP_RESPONSE_CODE.MESSAGE._400,
        code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
    }
    let model

    let mResult = await userService.findOne(entities,{
        email:user.email
    });
    let result = mResult.data
    if(!result){
        error=ALL_AUTH_CODE["600"]
        errors.push({
            msg:'Email is invalid or does not exist anymore!'
        })
    }else {
        if(result.isPassCodeVerified){
            result.password = await bcrypt.hash(user.password, 10);
            let user=await userService.updateOne(entities,result);
            let data=user.data
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
            model= {data};
        }else {
            error=ALL_AUTH_CODE["607"]
            errors.push({
                msg:`The reset password code sent to ${result.email} was not verified yet. Try to verify reset password code first!`
            } )

        }

    }
    response.data=model
    if(errors.length>0){
        response.error=error
        response.error.errors=errors
    }
    if(mResult.error){
        if(mResult.error?.errors){
            response.error.errors=[...response.error.errors,mResult.error.errors]
        }
        if(mResult.error?.node){
            response.error.message=HTTP_RESPONSE_CODE.MESSAGE._500
            response.error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
            response.error.node= {msg:'Internal error with server to /reset-password'}
        }
    }

    return response

};
export default resetPassword
