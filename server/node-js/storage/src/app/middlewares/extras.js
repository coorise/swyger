import HTTP_RESPONSE_CODE from "../helpers/all-http-response-code";
import SocketResponse from "../helpers/response-socket";
import Response from "../helpers/response";
import getDataFromRequest from "../helpers/extract-data";
import axios from "axios";

const rootApi = process.env.API_PATH ||'/api/v1';
const ace={
    user:process.env.ACE_USER,
    pass:process.env.ACE_PASS
}
export default class ExtrasMiddleware{

    required=async (req,res,next)=>{
        let {
            data,
            path,
            listen,
            socket,
            response,
            result,
            extras
        } = getDataFromRequest(req)
        let err
        //console.log('getting extras parameters: ',extras)
        if(extras){
            if(extras !=='base'){
                /*const extras={}
             const arrayPath=extras?.split('/')
             if(arrayPath.length>=1){
                 //Make your own path to JSON
                 let current=extras
                 let extraPath='extras'
                 let last=extras
                 extras.split('/').forEach((segment,i)=>{
                     if (segment !== '') {
                         if (!(segment in current)) {
                             //console.log('get incrementation ',i, 'with length ',extras.split('/').length)
                             if(extras.split('/').length-1===i){
                                 current[segment] = ''
                             }else {
                                 current[segment] = {}
                             }

                         }

                         current = current[segment]
                         extraPath=extraPath+'.'+segment

                     }
                 })
                 console.log('get the last child ',extraPath)
                 console.log('getting query extras data: ',extras)
             }*/
                //Please visit  the acebase client: https://www.npmjs.com/package/acebase-client
                if(req?.acebaseClient?.auth){
                    await req?.acebaseClient?.auth
                        ?.signIn(ace.user,ace.pass)
                        ?.then(async (admin)=>{

                            if(admin?.accessToken){
                                //console.log('get admin info : ', admin?.user)
                                //console.log('get admin accessToken : ', admin?.accessToken)
                                //const result=await userService.findOne({uid:req?.user?.uid})
                                const user=req?.user
                                if(user?.uid){
                                    let request
                                    if(!user?.acebaseToken){
                                        let token = req.headers?.authorization?.replace('Bearer ','')
                                        request = await axios.post(
                                            req.authServerUrl+'/auth/acebase/singup/psTyuyyuy/pe/get-one',
                                            {
                                            },
                                            {headers: {
                                                    Authorization: `Bearer ${token}` ,
                                                    "Access-Key":req.authAdminToken,
                                                }}
                                        )?.catch(e=>{
                                            return {error:e}
                                        });
                                        if(request?.data){
                                            request=request?.data?.data?.data?.data || request?.data
                                            user.acebaseToken=request?.acebaseToken
                                        }
                                    }

                                    if(user?.acebaseToken){
                                        await req?.acebaseClient?.auth?.signInWithToken(user.acebaseToken)
                                            ?.then(()=>{})
                                            ?.catch(async (e)=>{});
                                    }

                                }



                            }else {
                                err={
                                    code:401,
                                    message:'The admin setting is not set correctly, please contact the admins'
                                }
                            }

                        })
                        .catch(e=>{
                            //console.log('Error ace message: ',err)
                            err={
                                code:401,
                                message:'The admin setting is not set correctly, please contact the admins'
                            }
                        })

                }
                else {
                    err={
                        code:500,
                        message:'Acebase database url is not set for this server, contact your admins'
                    }
                }
                /*const exists = await db.query('users')
                    .filter('email', '==', 'me@appy.one')
                    .exists();*/
            }

        }
        else {
            err={
                code:400,
                message:'We did not find the extras parameter from your request'
            }
        }
        if (err) {
            response.error = {}
            response.error.acebase = err
            console.log('error request extras middleware ', listen + path)
            /*if (socket) {
                socket.emit(listen + path, SocketResponse?.error(response))
                if (socket.sockets.sockets[data?.socket?.socketId]) {
                    socket.sockets.sockets[data?.socket?.socketId]?.disconnect();
                }
            }*/
            if(req.getAceError){
                req.getAceError=response
            }else {
                Response.error(res, response, response.error.token?.code)
            }

        }
        else {
            if(extras!=='base'){
                req.extrasPath=extras
                req.listenExtrasPath=listen+path
            }

            /*response={
                data:{
                    code:200,
                    message:'Successfully logged in with acebase'
                }
            }
            if(socket){
                //console.log('req.io.id ', req.id)
                if(!err)
                    socket.emit(listen+path,SocketResponse.success(response))
            }
            if(!isRequestFromSocket){
                Response.success(res, response);
            }*/
            if(typeof next=='function'){
                next()
            }else {
                req.extrasVerified=true
            }

        }
    }
}