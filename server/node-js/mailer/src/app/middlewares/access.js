import {jwt} from "../services";
import HTTP_RESPONSE_CODE from "../helpers/all-http-response-code";
import Response from "../helpers/response";

export default class AccessService{
    required=async (req, res, next)=> {
        let response={}
        let result={}
        let token = req.headers?.['access-key']
        try {
            let isVerified=await jwt.verify(token)
            if(isVerified){
                result={
                    data:isVerified
                }
            }
        }catch (e) {
            result={
                error:e.message
            }
        }
        if (result?.error) {
            response.error = {}
            response.error.accessKey = {
                code: HTTP_RESPONSE_CODE.UNAUTHORIZED_CODE,
                message: HTTP_RESPONSE_CODE.MESSAGE._401
            }
            /*if (socket) {
                socket.emit(listen + path, SocketResponse.error(response))
                /!*if (socket.sockets.sockets[data?.socket?.socketId]) {
                    socket.sockets.sockets[data?.socket?.socketId].disconnect();
                }*!/
            }*/
            if(req.getAccessError){
                req.getAccessError=response
            }else {
                Response.error(res, response, response.error.accessKey?.code)
            }

        }
        else {
            if(typeof next=='function'){
                next();
            }else {
                req.accessVerified=true
            }
        }
    }
}