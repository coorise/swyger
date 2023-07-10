import userService from '../../../../../../users/services/typeorm/users.service';
import HTTP_RESPONSE_CODE from "../../../../../../../../helpers/all-http-response-code";
import refreshTokenService from "../../../../../../refresh_tokens/services/typeorm/refresh_tokens.service";
import ALL_AUTH_CODE from "../../../../../../../../helpers/all-auth-code";
import generateToken from "../../subs/generate-token";

const verifyTokenCode = async (entities,data,args) => {
    const {location}=args
    let response={}
    let errors= []
    let error= {
        message: HTTP_RESPONSE_CODE.MESSAGE._400,
        code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
    }
    let model

    const mUser = await userService.findOne(entities,{
        email:data.email
    });


    if(!mUser?.data){
        error=ALL_AUTH_CODE["600"]
        errors.push({
            msg:'This email doesn\'t exist: '+data.email
        })
    }else {
        let mToken
        let  user=mUser.data
        if(data.tokenCode===0){
            error=ALL_AUTH_CODE["605"]
            errors.push({
                msg:'Code is not invalid: '+data.tokenCode
            })
        }else {

            let info={
                user_uid: user.uid,
                tokenCode:parseInt(data.tokenCode),
                user_agent:location.user_agent,
                revokedByIp:location.ipAddress
            }
            mToken = await refreshTokenService.findOne(entities,info)

            if (!mToken?.data) {
                error=ALL_AUTH_CODE["605"]
                errors.push({
                    msg:'Code is not invalid: '+data.tokenCode
                })
            }
            else {

                let refreshToken= mToken.data
                const token = generateToken(Object.assign({},mUser?.data));
                if(refreshToken?.isTokenVerified){
                    model={data:mUser?.data, token, refreshToken: mToken?.data?.token}
                }
                else
                if(refreshToken?.tokenCodeExpires>Date.now()){
                    refreshToken.tokenCode = 0;
                    refreshToken.tokenCodeExpires = 0;
                    refreshToken.isTokenVerified=true
                    mToken=await refreshTokenService.updateOne(entities,Object.assign({},refreshToken));
                    model={data:mUser?.data, token, refreshToken: mToken?.data?.token}
                }else {
                    error=ALL_AUTH_CODE["606"]
                    errors.push({
                        msg:'Code is already expired: '+data.tokenCode+'. Try to login again, we will send code to: '+data.email+' ,then retry'
                    })
                }

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
            response.error.node= {msg:'Internal error with server to /verify-token-code'}
        }
    }

    return response
};
export default verifyTokenCode
