import refreshTokenService from "../../../../../refresh_tokens/services/typeorm/refresh_tokens.service";
import {jwt} from "../../../../../../../services";
import Dayjs from "dayjs";
// @ts-ignore
import convertToMillis from 'ms'
const generateRefreshToken=async (entities,user, option)=>{

    const refreshToken = jwt.refreshSign(user);
    const expireIn=process.env.JWT_REFRESH_EXPIRES
    // save the token
    const mToken = await refreshTokenService.createOne(entities,{
        user_uid: user.uid,
        token: refreshToken.toString(),
        // @ts-ignore
        expireIn: Date.now()+convertToMillis(expireIn),
        createdAt:Dayjs(new Date()).format('YYYY-MM-DD HH:ss'),
        updatedAt:Dayjs(new Date()).format('YYYY-MM-DD HH:ss'),
        createdByIp: option.ipAddress,
        revokedByIp: option.ipAddress,
        isPrimaryToken:!!option.isPrimaryToken,
        isTokenVerified: !!option.isTokenVerified,
        user_agent:option.user_agent
    });
    //console.log('generate token ',mToken)
    return mToken
}

export default generateRefreshToken
