import userService from '../../../../../../users/services/typeorm/users.service';
import HTTP_RESPONSE_CODE from "../../../../../../../../helpers/all-http-response-code";
import generateToken from "../../subs/generate-token";
import refreshLoginToken from "../../subs/refresh-login-token";
import ALL_AUTH_CODE from "../../../../../../../../helpers/all-auth-code";

const verifyPassCode = async (entities,data,args) => {
    const {location={}}=args
    let response={}
    let errors= []
    let error= {
        message: HTTP_RESPONSE_CODE.MESSAGE._400,
        code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
    }
    let model
    let mUser
    const { passwordCode, email } = data;
    mUser = await userService.findOne(entities,{
        email
    })
    if(!mUser?.data){
        error=ALL_AUTH_CODE["600"]
        errors.push({
            msg:'This email doesn\'t exist: '+email
        })
    }
    else if(passwordCode===0){
        error=ALL_AUTH_CODE["605"]
        errors.push({
            msg:'Code is not valid: '+passwordCode
        })
    }else {
        mUser = await userService.findOne(entities,{
            email,
            passwordCode:parseInt(passwordCode)
        });
        const user=mUser.data

        if (!user) {
            error=ALL_AUTH_CODE["605"]
            errors.push({
                msg:'Code is not valid: '+passwordCode
            })
        }
        else {
            const token = generateToken(Object.assign({},mUser?.data));
            location.isTokenVerified=true
            let refreshToken = await refreshLoginToken(entities,mUser?.data, location);
            if(user.isPassCodeVerified){
                model={token,refreshToken: refreshToken?.data?.token}
            }
            else
            if(user.passwordCodeExpires>Date.now()){
                user.passwordCode = 0;
                user.passwordCodeExpires = 0;
                user.isPassCodeVerified=true
                mUser=await userService.updateOne(entities,Object.assign({},user));
                model={token,refreshToken: refreshToken?.data?.token}
            }else {
                error=ALL_AUTH_CODE["606"]
                errors.push({
                    msg:'Code is already expired: '+passwordCode
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
            response.error.node= {msg:'Internal error with server to /verify-pass-code'}
        }
    }

    return response
};
export default verifyPassCode
