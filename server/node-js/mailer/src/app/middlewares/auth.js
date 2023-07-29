import Response from '../helpers/response';
import {jwt} from '../services';

import axios from "axios";
import HTTP_RESPONSE_CODE from "../helpers/all-http-response-code";
import SocketResponse from "../helpers/response-socket";
import getDataFromRequest from "../helpers/extract-data";
import ALL_DATA_CODE from "../helpers/all-mailer-code";

export default class AuthService {

    required=async (req, res, next)=> {
        let {
            data,
            path,
            listen,
            socket,
            response,
            result,
            extras
        } = getDataFromRequest(req)


        let token = req.headers?.authorization?.replace('Bearer ','')
        //console.log('get bearer token: ',token)
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
            response.error.token = {
                code: HTTP_RESPONSE_CODE.UNAUTHORIZED_CODE,
                message: HTTP_RESPONSE_CODE.MESSAGE._401
            }
            console.log('error request user auth middleware ', listen + path)
            /*if (socket) {
                socket.emit(listen + path, SocketResponse.error(response))
                /!*if (socket.sockets.sockets[data?.socket?.socketId]) {
                    socket.sockets.sockets[data?.socket?.socketId].disconnect();
                }*!/
            }*/
            if(req.getAuthError){
                req.getAuthError=response
            }else {
                Response.error(res, response, response.error.token?.code)
            }

        }
        else {
            //logger.info('Log test get uid from token')
            let request = await axios.post(
                req.authServerUrl+'/auth/user/psTyuyyuy/pe/get-one',
                {
                },
                {headers: {
                        Authorization: `Bearer ${token}` ,
                        "Access-Key":req.authAdminToken,
                    }}
            ).catch(e=>{
                return {error:e}
            });
            //console.log('user data: ', result.data)
            if(request?.error){
                response.error = {}
                response.error.auth = ALL_DATA_CODE["600"]

                //console.log('error request user not exist anymore on database with that token  auth middleware ', listen + path)
                /*if (socket) {
                    socket.emit(listen + path, SocketResponse.error(response))
                    if (socket.sockets.sockets[data?.socket?.socketId]) {
                        socket.sockets.sockets[data?.socket?.socketId].disconnect();
                    }
                }*/
                if(req.getAuthError){
                    req.getAuthError=response
                }else {
                    Response.error(res, response, response.error.token?.code)
                }

            }else {
                req.user=request?.data?.data?.data
                req.clientToken=token
                if(typeof next=='function'){
                    next();
                }

            }
        }

    }

}



