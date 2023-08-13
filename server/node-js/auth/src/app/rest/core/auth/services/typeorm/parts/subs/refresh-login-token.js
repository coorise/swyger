import {jwt, logger} from "../../../../../../../services";
import refreshTokenService from "../../../../../refresh_tokens/services/typeorm/refresh_tokens.service";
import userService from '../../../../../users/services/typeorm/users.service';
import generateRefreshToken from "./generate-refresh-token";
import sendTokenVerification from "../otp/email/send-token-verification";
// @ts-ignore
import convertToMillis from 'ms'
import Dayjs from "dayjs";

const refreshLoginToken = async (entities,data, location) => {

    const mRefreshToken = await refreshTokenService.findOne(entities,{
        user_uid: data.uid,
        user_agent:location.user_agent,
        revokedByIp:location.ipAddress
    });
    let refreshToken=mRefreshToken.data

    if (refreshToken?.token) {
        const expireIn=process.env.JWT_REFRESH_EXPIRES

        const mUser = await userService.findOne(entities,{
            // @ts-ignore
            uid: refreshToken.user_uid
        });
        const muser=mUser.data
        // @ts-ignore
        delete muser.password
        // @ts-ignore
        delete muser.resetPasswordToken
        // @ts-ignore
        delete muser.resetPasswordExpires;

        // @ts-ignore
        delete muser.temporaryPassword;

        //console.log('refreshToken ', Object.assign({},muser))

        //logger.log('info','login mongo userId is :'+ muser.uid)
        //logger.log('info','Auth/Services/Login$ user id is: '+ user.uid)
        // @ts-ignore
        const previous=refreshToken.token

        // @ts-ignore
        refreshToken.token = jwt.refreshSign(Object.assign({},muser))
        //refreshToken.revoked = Date.now();
        // @ts-ignore
        refreshToken.expireIn=Date.now()+convertToMillis(expireIn)
        // @ts-ignore
        refreshToken.revokedByIp = location.ipAddress;
        // @ts-ignore
        refreshToken.user_agent=location.user_agent
        // @ts-ignore
        refreshToken.previousToken = previous
        refreshToken.updatedAt= Dayjs(new Date()).format('YYYY-MM-DD HH:ss')
        if(location?.isTokenVerified){
            refreshToken.isTokenVerified=true
        }

        let newRefreshToken = await refreshTokenService.updateOne(entities,refreshToken);
        // @ts-ignore
        if(!newRefreshToken?.data?.isTokenVerified){
            await sendTokenVerification(entities,
                Object.assign({},data),
                location,
                Object.assign({},newRefreshToken?.data)
            )
            newRefreshToken={
                error:`Please visit de code sent to email: ${data.email} in order to activate this new session, it will expire in 1h`
            }
        }
        // @ts-ignore
        return newRefreshToken
    } else {
        // @ts-ignore
        let refreshNewToken=await generateRefreshToken(entities,
            Object.assign({},data),location);
        //console.log('get data user', refreshToken?.data)

        await sendTokenVerification(entities,
            Object.assign({},data),
            location,
            Object.assign({},refreshNewToken?.data)
            )
        if(!refreshNewToken?.data?.isTokenVerified){
            refreshNewToken={
                error:`Please visit de code sent to ${data.email} in order to activate this new device`
            }
        }
        return refreshNewToken
    }
};

export default refreshLoginToken
