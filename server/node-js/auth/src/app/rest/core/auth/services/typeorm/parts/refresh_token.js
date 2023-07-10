import refreshTokenService from "../../../../refresh_tokens/services/typeorm/refresh_tokens.service";
import userService from '../../../../users/services/typeorm/users.service';
import {jwt, logger} from "../../../../../../services";
import generateToken from "./subs/generate-token";
import HTTP_RESPONSE_CODE from "../../../../../../helpers/all-http-response-code";
const refreshToken = async (entities,data, args) => {
    const {location}=args
    let response={}
    let errors= []
    let error= {
        message: HTTP_RESPONSE_CODE.MESSAGE._400,
        code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
    }
    let model

    if(!data?.token){
        errors.push({
            msg:'No token found'
        })
    }
    const mRefreshToken = await refreshTokenService?.findOne(entities,{
        token:data?.token
    });
    const refreshToken=mRefreshToken?.data


    if (refreshToken) {


        if(!jwt.refreshVerify(refreshToken?.token)){
            errors.push({
                msg:'Token is expired: '+data?.token
            })
        }else{
            const mUser = await userService?.findOne(entities,{
                uid: refreshToken.user_uid
            });
            const muser=mUser.data
            delete muser.password
            delete muser.resetPasswordToken;
            delete muser.resetPasswordExpires;
            delete muser.temporaryPassword;

            const newToken = generateToken(Object.assign({},muser));

            const previous=refreshToken.token
            refreshToken.token = jwt.refreshSign(Object.assign({},muser));
            refreshToken.revoked = Date.now();
            refreshToken.revokedByIp = location.ipAddress;
            refreshToken.previousToken = previous;
            const newRefreshToken = await refreshTokenService.updateOne(entities,Object.assign({},refreshToken));
            model= { token: newToken, refreshToken: newRefreshToken.data?.token };
        }

    } else {
        errors.push({
            msg:'Token doesn\'t exist: '+data?.token
        })
    }
    response.data=model
    if(errors.length>0){
        response.error=error
        response.error.errors=errors
    }
    if(mRefreshToken.error){
        if(mRefreshToken.error?.errors){
            response.error.errors=[...response.error?.errors,mRefreshToken.error.errors]
        }
        if(mRefreshToken.error?.node){
            response.error.message=HTTP_RESPONSE_CODE.MESSAGE._500
            response.error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
            response.error.node= {msg:'Internal error with server to /refresh-token'}
        }
    }

    return response
};

export default refreshToken
