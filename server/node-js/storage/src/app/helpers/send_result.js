import Response from './response';
import SocketResponse from "./response-socket";
import HTTP_RESPONSE_CODE from "./all-http-response-code";
import {mode} from "../config";
import {LocalStorageService} from "../services/storage/local";
import {DiscordStorageService} from "../services/storage/discord";
import getDataFromRequest from "./extract-data";

const localStorageService=new LocalStorageService()
const discordStorageService=new DiscordStorageService()

let sendResult=async (service,option,req,res,next)=>{
    let storageService

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
        switch (data?.storage) {
            case 'discord':
                storageService=discordStorageService
                    break;
            case 'aws':
                storageService={}
                break;
            default:
                storageService=localStorageService
                break;
        }
        let config=data?.config

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
                    //path=path+option.path
                    if(!data){
                        data={}
                    }
                    data.path=req?.extrasPath
                    if(end.includes('download')) {
                        data.withFile = true
                        data.withDownload = true
                    }
                    if(data?.isFolder){
                        storageService=storageService.folder
                    }else {
                        storageService=storageService.file
                    }
                    result=await storageService?.[option.function]({req,res,config},data,null,async (aceData,data,func=option.function)=>{
                        let resp
                        resp = await service?.[func](req?.acebaseClient,aceData);
                        /*if(res?.data){
                            resp = await service[func](req.entitySchema,data,option?.args);
                        }*/
                        return resp
                    })
                }else {
                    result={
                        error:{
                            message:'No extras path found'
                        }
                    }
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
                    response.error.storage=result.error
                    /*if(socket){
                        socket.emit(listen+path,SocketResponse.error(response))
                    }*/

                    return Response.error(res,response,response.error.storage?.code)

                }

                //------------------------Success Response-----------------------//

                if(result?.data){
                    response.data=result.data
                    if(socket){
                        //console.log('req.io.id ', req.id)
                        if(!result?.error)
                            socket.emit(listen+path,SocketResponse.success(response))
                    }
                    Response.success(res, response);

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

    let storageService

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


        switch (data?.storage) {
            case 'discord':
                storageService=''
                break;
            case 'aws':
                storageService=''
                break;
            default:
                storageService=localStorageService
                break;
        }
        let config=data?.config

        //------------------------Response-----------------------//
        if(option?.function){
            let result={}
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
                    //path=path+option.path
                    if(!data){
                        data={}
                    }
                    data.path=req?.extrasPath
                    if(end.includes('download')) {
                        data.withFile = true
                        data.withDownload = true
                    }
                    if(data?.isFolder){
                        storageService=storageService.folder
                    }else {
                        storageService=storageService.file
                    }
                    result=await storageService?.[option.function]({req,res,config},data,null,async (aceData,data,func=option.function)=>{
                        let resp

                        //console.log('folders many service: ', service)
                        resp = await service[func](req?.acebaseClient,aceData);
                        /*if(res?.data){
                            resp = await service[func](req.entitySchema,data,option?.args);
                        }*/
                        return resp
                    })
                }else {
                    result={
                        error:{
                            message:'No extras path found'
                        }
                    }
                }
                console.log('request path ', listen+path)

                await req?.acebaseClient?.auth?.signOut()
                    .then(result => {
                        //console.log(`Signed out!`);
                    }).catch(e=>{})

                let error
                if(result?.error) error={storage:result?.error}
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