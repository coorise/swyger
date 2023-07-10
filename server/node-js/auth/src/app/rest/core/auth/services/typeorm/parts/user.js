import userService from "../../../../users/services/typeorm/users.service";
import HTTP_RESPONSE_CODE from "../../../../../../helpers/all-http-response-code";
import ALL_AUTH_CODE from "../../../../../../helpers/all-auth-code";

const user = async (entities,user, args) => {
    let response={}
    let errors= []
    let error= {
        message: HTTP_RESPONSE_CODE.MESSAGE._400,
        code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
    }
    let model
    //console.log('get user id ', user?.uid)
    const mData = await userService.findOne(entities,{
        uid:user?.uid
    });
    if(mData.data){
        const data=Object.assign({},mData.data)
        delete data.password
        delete data.resetPasswordToken;
        delete data.resetPasswordExpires;
        delete data.temporaryPassword;
        delete data.verifyPassword
        delete data.extras
        delete data.emailCode
        delete data.phoneCode
        delete data.passwordCode
        delete data.emailCodeExpires
        delete data.passwordCodeExpires
        delete data.phoneCodeExpires

        model={data:data,}
    } else {
        error=ALL_AUTH_CODE["600"]
        errors.push({
            msg:'User does not exist: '
        })
    }
    response.data=model
    if(errors.length>0){
        response.error=error
        response.error.errors=errors
    }
    if(mData.error){
        if(mData.error?.errors){
            response.error.errors=[...response.error.errors,mData.error.errors]
        }
        if(mData.error?.node){
            response.error=ALL_AUTH_CODE["500"]
            response.error.node= {msg:'Internal error with server to /login'}
        }
    }

    return response
}
export default user