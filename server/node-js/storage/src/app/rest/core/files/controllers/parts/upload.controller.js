import {LocalStorageService} from "../../../../../services/storage/local";
import {DiscordStorageService} from "../../../../../services/storage/discord";
import getDataFromRequest from "../../../../../helpers/extract-data";
import ExtrasMiddleware from "../../../../../middlewares/extras";
import AuthMiddleware from "../../../../../middlewares/auth";
import AccessMiddleware from "../../../../../middlewares/access";
import Busboy from 'busboy'
import {AcebaseService} from "../../../../../helpers/common/service/acebase";
import {v4} from 'uuid'
import mime from 'mime';
import pathFS from 'path';
import {uploadToDiscord} from "../../../../../services/storage/discord/api";
import {wait} from "../../../../../services/storage/discord/utils/time";
import Response from "../../../../../helpers/response";
import fs from "fs-extra";
import SocketResponse from "../../../../../helpers/response-socket";


const acebaseService=new AcebaseService()
const CHUNK_SIZE = 8388608; // 8 MB

let storageDir=process.env.STORAGE_DIR||'storage'
const uploadController=[
    '/storage/*/upload',
    async (req,res,next)=>{
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
        //console.log('get extras: ',extras)
        //console.log('get query: ',req.query)

        let customPath
        /*const uid=v4()
        fileInfo.uid=uid*/
        let channelId
        let token

        /*req.on('data',(chunk)=>{
            console.log('get formData: ', chunk)
        })
        req.on('end',()=>{
            res.send('saved')
        })*/



        let authAccess=[
            1
        ]
        let countFiles=[]
        let streamResult=[]
        let listError=[]
        let storage='local'
        switch (data?.storage) {
            case 'aws':
                //visit: https://stackoverflow.com/questions/65362731/aws-sdk-file-upload-to-s3-via-node-express-using-stream-passthrough-file-is-al
                //visit: https://stackoverflow.com/questions/36911100/node-js-stream-data-from-busboy-to-aws-s3
                storage='aws'
                break;
            case 'discord':
                storage='discord'
                if(data?.config?.channelId) channelId=data?.channelId
                if(data?.config?.token) token=data?.token
                break;
            default:
                storage='local'
                break;
        }



        try {
            //visit: https://github.com/mscdex/busboy#readme
            let busboy = Busboy({
                headers: req.headers,
                /*limits: {
                    fileSize: 10 * 1024 * 1024, // 10 mb
                },*/
            });
            busboy.on('field', async (name, val, info) => {
                //console.log(`Field [${name}]: value: %j`, val);
                //console.log('file info: ', info)
            });
            busboy.on('file', async (name, file, info) => {
                const { filename, encoding, mimeType } = info
                let chunks = [];
                let fill = 0;
                let fileInfo={}
                let uploadedParts = [];

                let requestEnded = false;
                let fileSize = 0;
                let filesToUpload = [];
                let extension

                if(authAccess.length>0){
                    req.getAccessError={}
                    const accessMiddleware=new AccessMiddleware()
                    await accessMiddleware.required(req,res)
                    if(req.accessVerified){
                        req.getAuthError={}
                        const authMiddleware=new AuthMiddleware()
                        await authMiddleware.required(req, res)

                        if(req.user){
                            req.getAceError={}
                            const extrasMiddleware=new ExtrasMiddleware()
                            await extrasMiddleware.required(req,res)
                            if(!req.extrasVerified){
                                if (!res.headersSent)
                                    Response.error(res,req.getAceError)
                                return
                            }
                        }else {
                            if (!res.headersSent)
                                Response.error(res,req.getAuthError)
                            return
                        }
                    }else {
                        if (!res.headersSent)
                            Response.error(res,req.getAuthError)
                        return
                    }

                    authAccess=[]
                }

                //console.log('file info: ', info)
                //if(!filename)
                if(filename && req.user && req.extrasVerified){
                    if(extras.charAt(0)!=='/') extras='/'+extras
                    extension=pathFS.extname(filename)
                    if(filename?.includes('%%')){
                        customPath=filename.split('%%')
                        if(customPath[0]==='') customPath.shift()
                        const name=customPath.pop()

                        customPath='/'+customPath?.reduce((prev,current)=>prev+'/'+current)
                        //console.log('customPath: ', customPath)
                        //console.log('name: ',name )
                        fileInfo.name=name
                        fileInfo.path=extras+customPath
                    }else {
                        fileInfo.name=filename
                        fileInfo.path=extras
                    }
                    fileInfo.uid=v4()
                    fileInfo.extension=extension
                    fileInfo.type=mime.getType(filename)
                    fileInfo.isFolder=false
                    if(storage!=='local')
                    fileInfo.channelId=channelId
                    fileInfo.storage=storage


                    result=await acebaseService.createOne(req?.acebaseClient,{
                        path:fileInfo.path+'/'+fileInfo.uid,
                        value: {
                            uid:fileInfo.uid
                        }
                    })
                    if(result.error) listError.push({
                        path:fileInfo.path,
                        name:fileInfo.name,
                        error:result.error
                    })
                }else {
                    result={
                        error:{
                            message:'The filename does not exist! Or the user is not logged in'
                        }
                    }
                    listError.push({
                        path:fileInfo.path,
                        name:fileInfo.name,
                        error:result.error
                    })
                }

                file.on('data', function(chunk) {
                    if(result.error){
                        req.acebaseNotAllowed=true
                    }else if(req.user && req.extrasVerified) {
                        req.acebaseNotAllowed=false
                        //console.log('file ', chunk)
                        //console.log('File [' + data + '] got ' + data.length + ' bytes');

                        if(storage!=='local'){
                            chunks.push(chunk);
                            // Current length of total chunks
                            fill += chunk.length;
                            fileSize += chunk.length;
                            // While current length is greater than max chunk size
                            // Use while instead of if because there can be chunks that are twice or three times bigger than the max chunk size
                            while (fill >= CHUNK_SIZE) {
                                // Create a new chunk with that exact size
                                const newChunk = Buffer.concat(chunks, CHUNK_SIZE);

                                // Get the residue of the last chunk after creating a new chunk
                                const lastChunk = chunks.slice(-1)[0];
                                const residueLength = fill - CHUNK_SIZE;

                                // Set the chunks arr with the remaining from the last chunk
                                chunks =
                                    residueLength === 0
                                        ? []
                                        : [Buffer.from(lastChunk.slice(-residueLength))];

                                fill = residueLength;

                                filesToUpload.push(newChunk);
                            }
                        }

                    }

                });

                file.on('close', function() {
                    //console.log('File ' + filename + ' Finished');
                    //console.log('MimeType ' + mimeType + ' Finished');
                    // Add the final chunks if there is any left-over

                    //requestEnded = true;
                    if(result.error){

                    }else {
                        if(storage!=='local'){
                            if (chunks.length > 0) {
                                const newChunk = Buffer.concat(chunks);

                                filesToUpload.push(newChunk);
                            }
                        }


                    }

                });
                countFiles.push({
                    fileInfo,
                    fileSize,
                    uploadedParts,
                    requestEnded,
                    filesToUpload

                })

                if(storage==='local' && req.user && req.extrasVerified){
                    const uploadPath=storageDir+fileInfo?.path+'/'+fileInfo?.uid+extension
                    fs.ensureFileSync(uploadPath)
                    let outStream = fs.createWriteStream(uploadPath);
                    file.pipe(outStream);
                }

            });
            busboy.on('close', async function () {
                if (req.user && req.extrasVerified) {
                    /*res.writeHead(200, {
                        'Connection': 'close'
                    });
                    res.end("That's all folks!");*/
                    if (req.acebaseNotAllowed && listError.length===1) {
                        if (!res.headersSent)
                            Response.error(res,{error:{
                                    message:'Not allowed to write',
                                    detail:listError[0]
                                }
                            })
                    } else {
                        while (countFiles.length>0) {
                            let val = countFiles.shift()
                            //const i = countFiles.indexOf(val);
                            if(storage!=='local'){
                                let uploadedCount = 0;
                                // || !val.requestEnded
                                while (val.filesToUpload.length > 0) {
                                    if (val.filesToUpload.length === 0) {
                                        await wait(200);
                                    } else {
                                        const file=val.filesToUpload.splice(0, 1)[0]
                                        val.fileInfo.size+=Buffer.from(file).length
                                        switch (storage){
                                            case 'aws':
                                                //visit: https://stackoverflow.com/questions/59295384/multiple-file-upload-to-s3-with-node-js-busboy
                                                break;
                                            case 'discord':
                                                const upload = await uploadToDiscord(
                                                    token,
                                                    channelId,
                                                    file,
                                                    `${val.fileInfo.name}-chunk-${++uploadedCount}`,
                                                    {
                                                        name:val.fileInfo.name,
                                                        mimeType:val.fileInfo.type,
                                                        extension:val.fileInfo.extension,
                                                        chunkPart:uploadedCount,
                                                    }
                                                );
                                                if(upload?.id){
                                                    const {attachments,id,timestamp}=upload
                                                    val.uploadedParts.push({
                                                        messageId:id,
                                                        timestamp,
                                                        attachmentId:attachments?.[0].id,
                                                        url:attachments?.[0].url
                                                    });
                                                }else {
                                                    if (!res.headersSent)
                                                    Response.error(res,{error:{
                                                            message:'Not allowed to write on discord',
                                                            detail:{
                                                                message:'Please check your token and channel id'
                                                            }
                                                        }
                                                    })
                                                }

                                                break;
                                        }

                                    }
                                }
                            }
                            if(val.uploadedParts.length>0){
                                val.fileInfo.parts=val.uploadedParts
                                val.fileInfo.totalChunks=val.uploadedParts .length
                            }
                            if(storage==='local'){
                                const uploadPath=storageDir+val.fileInfo?.path+'/'+val.fileInfo?.uid+val.fileInfo.extension
                                if(fs.pathExistsSync(uploadPath)){
                                    try {
                                        let stat=fs?.statSync(uploadPath)
                                        val.fileInfo.size=stat?.size
                                    }catch (e) {

                                    }

                                }

                            }
                            let service = await acebaseService.updateOne(req?.acebaseClient, {
                                path: val.fileInfo.path + '/' + val.fileInfo.uid,
                                value: val.fileInfo
                            })
                            //console.log('file info: ', service?.data)
                            streamResult.push(service?.data)
                        }

                        //countFiles.splice(0, 1)
                        //streamResult.pop()
                        if(streamResult.length>1){
                            if (!res.headersSent){
                                let resp={
                                    data:streamResult,
                                }
                                if(listError.length>0) resp.error={
                                    message:'Not allowed to write',
                                    detail:listError
                                }
                                if(socket){
                                    //console.log('req.io.id ', req.id)
                                    //if(!result?.error)
                                    socket.emit(listen+path,SocketResponse.success(resp))
                                }
                                Response.success(res,resp)
                            }

                            //return res.send({data:result}).catch((e)=>{})
                        }else {
                            if (!res.headersSent){
                                let resp={data:streamResult[0]}
                                if(socket){
                                    //console.log('req.io.id ', req.id)
                                    //if(!result?.error)
                                    socket.emit(listen+path,SocketResponse.success(resp))
                                }
                                Response.success(res,resp)
                                //return res.send({data:result[0]}).catch((e)=>{})
                            }

                        }

                       //req.send('saved')
                    }

                }

            });
            req.pipe(busboy)
        }catch (e) {
            if (!res.headersSent)
            Response.error(res,{error:e.message})
        }




    }
]
export default uploadController