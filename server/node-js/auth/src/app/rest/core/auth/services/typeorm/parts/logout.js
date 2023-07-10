import refreshTokenService from "../../../../refresh_tokens/services/typeorm/refresh_tokens.service";
import HTTP_RESPONSE_CODE from "../../../../../../helpers/all-http-response-code";

const logout = async (entities,data) => {
    let response={}
    let model

    const result = await refreshTokenService.deleteOne(entities,data);

    if(result.data) {
        model=true
    }
    // @ts-ignore
    response.data=model
    if(result.error && !result.error?.node){
        response.error=result.error
    }
    if(result.error?.node){
        response.error.message=HTTP_RESPONSE_CODE.MESSAGE._500
        response.error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
        response.error.node= {msg:'Internal error with server to /logout'}
    }

    return response
};
export default logout
