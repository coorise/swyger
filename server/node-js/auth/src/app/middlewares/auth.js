import Response from '../helpers/response';
import {jwt, logger} from '../services';
import passport from 'passport'
import HTTP_RESPONSE_CODE from "../helpers/all-http-response-code";
import SocketResponse from "../helpers/response-socket";
import usersService from "../rest/core/users/services/typeorm/users.service";
import ALL_AUTH_CODE from "../helpers/all-auth-code";
import getDataFromRequest from "../helpers/extract-data";

export default class AuthMiddleware {
  getTokenFromHeaderOrQuerystring=(req)=> {
    const re = /(\S+)\s+(\S+)/;
    if (req.headers.authorization) {
      const matches = req.headers.authorization.match(re);
      return matches && { scheme: matches[1], value: matches[2] };
    } else if (req.query && req.query.token) {
      const matches = req.query.token.match(re);
      return matches && { scheme: matches[1], value: matches[2] };
    } else {
      return null;
    }
  }

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

      //console.log('request middleware')

      /*const token=this.getTokenFromHeaderOrQuerystring(req)
      const verify= async ()=>{
          try {
              return await jwt.verify(token)
          }catch (e) {
             return false
          }
      }
      if(!await verify()){
          response.error={}
          response.error.token={
              code: HTTP_RESPONSE_CODE.UNAUTHORIZED_CODE,
              message: HTTP_RESPONSE_CODE.MESSAGE._401
          }
          console.log('request err path middleware ', listen+path)
          if(socket){
              socket.emit(listen+path,SocketResponse.error(response))
              /!*if (socket.sockets.sockets[data?.socket?.socketId]) {
                  socket.sockets.sockets[data?.socket?.socketId].disconnect();
              }*!/
          }
          if(!isRequestFromSocket){
              Response.error(res,response,response.error.token?.code)
          }
      }
      else {
          next()
      }*/
      return passport.authenticate(
        'jwt',
        { session: false },
        async (err, user, info) => {
            // console.log('=======info==========', info);

            if (err) {
                response.error = {}
                response.error.node = {
                    code: HTTP_RESPONSE_CODE.MESSAGE._500,
                    message: HTTP_RESPONSE_CODE.MESSAGE._500
                }
                //console.log('error request err auth middleware ', listen + path)
                /*if (socket) {
                    socket.emit(listen + path, SocketResponse.error(response))
                    /!*if (socket.sockets.sockets[data?.socket?.socketId]) {
                        socket.sockets.sockets[data?.socket?.socketId].disconnect();
                    }*!/
                }*/
                Response.error(res, response, response.error.token?.code)
            }
            if (!user) {

                response.error = {}
                response.error.token = {
                    code: HTTP_RESPONSE_CODE.UNAUTHORIZED_CODE,
                    message: HTTP_RESPONSE_CODE.MESSAGE._401
                }
                /*console.log('error request user auth middleware ', listen + path)
                if (socket) {
                    socket.emit(listen + path, SocketResponse.error(response))
                    if (socket.sockets.sockets[data?.socket?.socketId]) {
                        socket.sockets.sockets[data?.socket?.socketId].disconnect();
                    }
                }*/
                Response.error(res, response, response.error.token?.code)
            } else {
                //logger.info('Log test get uid from token')
                let result = await usersService.findOne(req.entitySchema, {uid: user.uid})
                //console.log('getting user info ',result)
                if(result.error){
                    response.error = {}
                    response.error.auth = ALL_AUTH_CODE["600"]
                    /*console.log('error request user not exist anymore on database with that token  auth middleware ', listen + path)
                    if (socket) {
                        socket.emit(listen + path, SocketResponse.error(response))
                        if (socket.sockets.sockets[data?.socket?.socketId]) {
                            socket.sockets.sockets[data?.socket?.socketId].disconnect();
                        }
                    }*/
                    Response.error(res, response, response.error.token?.code)
                }else {
                    req.user=result.data
                    //console.log('get user ', req?.user?.uid)
                    next()
                }
            }
        }
      )(req, res, next);

  }

}



