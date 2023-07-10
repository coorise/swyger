import adminToken from '../helpers/get-token'
import Response from "../helpers/response";
import HTTP_RESPONSE_CODE from "../helpers/all-http-response-code";
const isAdmin=(req,res,next)=>{
    let response={}
    const is_admin=adminToken.getToken(req)
    if(is_admin){
        return next()
    }
    response.error={}
    response.error.admin={
        code: HTTP_RESPONSE_CODE.UNAUTHORIZED_CODE,
        message: 'Something went wrong with admin token',
        errors:[
            'invalid token'
        ]
    }
    return Response.error(res,response,HTTP_RESPONSE_CODE.UNAUTHORIZED_CODE);
}

export default {
    isAdmin
}
