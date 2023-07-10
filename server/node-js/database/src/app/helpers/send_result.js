import Response from './response';
import SocketResponse from "./response-socket";
import HTTP_RESPONSE_CODE from "./all-http-response-code";
import {mode} from "../config";
import getDataFromRequest from "./extract-data";

let sendResult=async (service,option,req,res,next)=>{
    try {
        let {
            data,
            path,
            listen,
            socket,
            response,
            result,
            extras,
            end
        } = getDataFromRequest(req)

        if(option?.function){
            if(!option?.args){
                option.args={}
            }

            if(option?.isValidation){
                if(!req?.extrasPath){
                    result = await service[option.function](data,option?.args);
                }
                if(result?.error){
                    response.error={}
                    response.error.validation=result.error
                    /*if(socket){
                        socket.emit(listen+path,SocketResponse.error(response))
                    }*/
                    return Response.error(res,response,response.error.validation?.code)
                }
                next()
            }else{
                data=data?.data
                if(req?.extrasPath){
                    if(!data){
                        data={}
                    }
                    const aceData={
                        path:req?.extrasPath,
                        value:data
                    }
                    result = await service[option.function](req?.acebaseClient,aceData);
                }else {
                    result = await service[option.function](req.entitySchema,data,option?.args);
                }
                //console.log('request device: ',req)
                console.log('request path ', listen+path)
                //console.log('access key ', req.headers['access-key'])
                //console.log('result: ', result)
                await req?.acebaseClient?.auth?.signOut()
                    .then(result => {
                        //console.log(`Signed out!`);
                    }).catch(e=>{})

                if(result?.error){
                    response.error={}
                    response.error.database=result.error
                    /*if(socket){
                        socket.emit(listen+path,SocketResponse.error(response))
                    }*/

                    return Response.error(res,response,response.error.database?.code)
                }
                //------------------------Success Response-----------------------//
                if(result?.data || result?.data===false){
                    response.data=result.data
                    if(socket){
                        //console.log('req.io.id ', req.id)
                        if(!result?.error)
                            socket.emit(listen+path,SocketResponse.success(response))
                    }
                    return Response.success(res, response);
                }

            }

        }
    }catch (e) {
        if(mode==='development'){
            console.log('Error ',option?.path, ': ',e)
        }
        /*res.status(HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE);
        res.send({
            code:HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE,
            message:HTTP_RESPONSE_CODE.MESSAGE._500,
            node:{
                msg:'Error '+option?.path+', check your api request on the server side'
            }
        })*/
    }

}
let sendResultWithError=async (service,option,req,res,next)=>{

    try {
        let {
            data,
            path,
            listen,
            socket,
            response,
            result,
            extras,
            end
        } = getDataFromRequest(req)

        //------------------------Response-----------------------//
        if(option?.function){
            if(!option?.args){
                option.args={}
            }
            if(option?.isValidation){
                if(!req?.extrasPath){
                    result = await service[option.function](data,option?.args);
                }
                if(result?.error){
                    response.error={}
                    response.error.validation=result.error
                    /*if(socket){
                        socket.emit(listen+path,SocketResponse.error(response))
                    }*/
                    return Response.error(res,response,response.error.validation?.code)

                }
                next()
            }else {
                data=data?.data
                if(req?.extrasPath){
                    if(!data){
                        data={}
                    }
                    const aceData={
                        path:req?.extrasPath,
                        value:data
                    }
                    result = await service[option.function](req?.acebaseClient,aceData);
                }else {
                    if(!data) data=[]
                    result = await service[option.function](req.entitySchema,data,option?.args);
                }
                console.log('request path ', listen+path)

                await req?.acebaseClient?.auth?.signOut()
                    .then(result => {
                        //console.log(`Signed out!`);
                    }).catch(e=>{})
                let error
                if(result?.error) error={storage:result?.error}
                if(result?.data || result?.data===false || result?.error){
                    response.data={
                        data:result.data,
                        error
                    }
                    if(socket){
                        //console.log('req.io.id ', req.id)
                        //if(!result?.error)
                        socket.emit(listen+path,SocketResponse.success(response))
                    }
                    return Response.success(res, response);
                }

            }

        }

    } catch (e) {
        if(mode==='development'){
            console.log('Error ',option?.path, ': ',e)
        }
        res.status(HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE);
        res.send({
            code:HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE,
            message:HTTP_RESPONSE_CODE.MESSAGE._500,
            node:{
                msg:'Error '+option?.path+', check your api request on the server side'
            }
        })
    }

}
export {
    sendResult,
    sendResultWithError
}