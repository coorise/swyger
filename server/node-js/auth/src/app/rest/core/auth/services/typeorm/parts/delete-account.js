import userService from '../../../../users/services/typeorm/users.service';
import refreshTokenService from "../../../../refresh_tokens/services/typeorm/refresh_tokens.service";
import HTTP_RESPONSE_CODE from "../../../../../../helpers/all-http-response-code";

//visit: https://github.com/typeorm/typeorm/blob/master/docs/delete-query-builder.md
const deleteAccount = async (entities,data,args) => {
    let {acebaseClient}=args
    let response={}
    let model
    let result = await userService.deleteOne(entities,
        {uid:data.uid}
    );

    let refresh = await refreshTokenService.findMany(entities,
        {
            query: {
                user_uid: data.uid,
                //token:data.token
            }
        }
    )
    if(refresh?.data){
        let tokens=await refresh.data?.data
        await refreshTokenService.deleteMany(entities,tokens)
    }

    if(result.data) {
        let user=result.data
        if(user?.acebaseToken){
            await acebaseClient?.auth?.signInWithToken(user.acebaseToken)
                ?.then(()=>{})
                ?.catch(async (e)=>{});
            await acebaseClient?.auth?.deleteAccount()
                ?.then(()=>{})
                ?.catch(async (e)=>{});
        }
        model=user
    }

    response.data=model
    if(result.error && !result.error?.node){
        response.error=result.error
    }
    if(result.error?.node){
        response.error.message='Something went wrong with server mail'
        response.error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
        response.error.node= {msg:'Internal error with server to /delete-account'}
    }

    return response
};
export default deleteAccount
