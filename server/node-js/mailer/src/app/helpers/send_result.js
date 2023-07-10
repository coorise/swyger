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
            end,
            extras
        } = getDataFromRequest(req)

        if(option?.function){
            if(!option?.args){
                option.args={}
            }

            if(option?.isValidation){
                result = await service[option.function](data,option?.args);
                if(result?.error){
                    response.error={}
                    response.error.validation=result.error
                    /*if(socket){
                        socket.emit(option?.path,SocketResponse.error(response))
                    }*/
                    return Response.error(res,response,response.error.validation?.code)

                }
                next()
            }else{
                data=data?.data
                if(['sendOne','sendMany'].includes(option.function)){
                    data=(()=>{
                        try {
                            if(data?.field){
                                return JSON.parse(data.field)
                            }else {
                                return data
                            }
                        }catch (e) {
                           return  {}
                        }
                    })()
                    result = await service[option.function](
                        {
                            sendMail:req?.sendMail,
                            mailComposer:req?.mailComposer,
                            data:{
                                ...data,
                                files:req?.files
                            }
                        },
                        option?.args);
                }else {
                    result = await service[option.function]({},data,option?.args);

                }


                if(result?.error){
                    response.error={}
                    response.error.mail=result.error
                    /*if(socket){
                        socket.emit(option?.path,SocketResponse.error(response))
                    }*/
                    return Response.error(res,response,response.error.mail?.code)
                }

                //------------------------Success Response-----------------------//

                if(result?.data){
                    response.data=result.data
                    if(socket){
                        //console.log('req.io.id ', req.id)
                        if(!result?.error)
                            socket.emit(option?.path,SocketResponse.success(response))
                    }
                    return Response.success(res, response)
                }

            }

        }
    }catch (e) {
        if(mode==='development'){
            console.log('Error ',option?.path, ': ',e)
        }
        res.status(HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE);
        if (!res.headersSent)
        res.send({
            code:HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE,
            message:HTTP_RESPONSE_CODE.MESSAGE._500,
            node:{
                msg:'Error '+option?.path+', check your api request on the server side'
            }
        })
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
            let result
            if(!option?.args){
                option.args={}
            }
            if(option?.isValidation){
                result = await service[option.function](data,option?.args);
                if(result?.error){
                    response.error={}
                    response.error.validation=result.error
                    /*if(socket){
                        socket.emit(option?.path,SocketResponse.error(response))
                    }*/
                    return Response.error(res,response,response.error.validation?.code)
                }
                next()
            }else {
                data=data?.data
                if(['sendOne','sendMany'].includes(option.function)){
                    data=(()=>{
                        try {
                            if(data?.field){
                                return JSON.parse(data.field)
                            }else {
                                return data
                            }
                        }catch (e) {
                            return  {}
                        }
                    })()
                    result = await service[option.function](
                        {
                            sendMail:req?.sendMail,
                            mailComposer:req?.mailComposer,
                            data: {
                                ...data,
                                files:req?.files
                            }
                        },
                        option?.args);
                }else {
                    result = await service[option.function]({},data,option?.args);

                }
                let error
                if(result?.error) error={mail:result?.error}
                if(result?.data || result?.error){
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
        if (!res.headersSent)
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