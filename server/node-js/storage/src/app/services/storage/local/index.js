import mime from 'mime';
import fs from 'fs-extra'
import move from 'fs-move'
import path from 'path';
import {v4} from "uuid";
import glob from "glob-all";
import {readdir, stat} from 'fs/promises';
import {promisify} from 'util';
import {file as fileStorage,folder as folderStorage} from './parts'
import {pipeline} from "stream";

const storageDir=process.env.STORAGE_DIR||'storage' //from your root project
fs.move=move
const commonArgs={
    mime,fs,path,v4,glob,readdir,
    stat,promisify,
    storageDir
}
class LocalStorageService{
    file={
        createOne:async ({req,res},data,file,callback,func)=>{
            /*return await fileStorage.createOne({
                ...commonArgs,
                file:(file)?file:(!Array.isArray(req.files?.file))?req.files?.file:undefined,
                data,req,res
                ,
            },callback,func)*/
            return {
                error:{
                    message:'Not the correct route, instead, you should upload your file with https:[host]:/storage/upload'
                }
            }
        },
        createMany:async ({req,res},data,file,callback)=>{
            /*let errors=[]
            let result=[]
            let response={}
            if(Array.isArray(req?.files?.file)){
                await Promise.all(req?.files?.file.map(async (file,i)=>{
                    return new Promise(async resolve=>{
                        const resp= await this.file.createOne(
                            {req},
                            {
                                path:data?.path,
                                name:data?.names?.[i]
                            },
                            file,
                            callback,
                            'createOne'
                        )
                        if(resp?.data){
                            result.push(resp.data)
                        }else {
                            errors.push(resp?.error?.message)
                        }
                        resolve()
                    })
                }))
            }else {
                errors.push({
                    message:'No files found in file parameter'
                })
            }
            //console.log('result ', result)
            if(errors.length>0)
                response.error=errors
            if(result.length>0)
                response.data=result

            return response*/
            return {
                error:{
                    message:'Not the correct route, instead, you should upload your files with https:[host]:/storage/upload'
                }
            }
        },
        findOne:async ({req,res},data,file,callback,func)=>await fileStorage.findOne({
            ...commonArgs,
            data,req,res
        },callback,func),
        findMany:async ({req,res},data,file,callback)=>{
            if(Array.isArray(data?.files)){
                let acepath=data?.path
                if(acepath.charAt(0)!=='/') acepath='/'+acepath
                const name=acepath.split('/').pop()

                let withFile
                let withDownload
                withFile=data?.withFile
                withDownload=data?.withDownload
                if(withDownload) withFile=false
                delete data.broadcastFile
                delete data.range
                delete data.isFolder
                delete data.withFile
                delete data.withDownload
                let errors=[]
                let result=[]
                let response={}
                let files=[]
                await Promise.all(data?.files.map(async (file,i)=>{
                    return new Promise(async resolve=>{
                        const resp= await this.file.findOne(
                            {req,res},
                            {
                                path:data?.path,
                                uid:data?.files?.[i]
                            },
                            null,
                            callback,
                            'findOne'
                        )
                        if(resp?.data){
                            if(withDownload || withFile){
                                const uploadPath=storageDir+acepath+'/'+resp.data?.uid+resp.data?.extension
                                files.push({path:uploadPath,name:acepath+'/'+resp.data?.name})
                            }else {
                                result.push(resp.data)
                            }

                        }else {
                            errors.push(resp?.error?.message)
                        }
                        resolve()
                    })
                }))
                //console.log('result ', result)
                try {
                    if(withDownload || withFile){
                        //console.log('get files: ', files)
                        if(files.length>0){
                            res.zip({
                                files,
                                filename:name+'.zip'
                            })
                        }

                        return {}
                    }else {
                        if(errors.length>0)
                            response.error=errors
                        if(result.length>0)
                            response.data=result

                        return response
                    }
                }catch (e) {

                }


            }else {
                await fileStorage.findOne({
                    ...commonArgs,
                    data,req,res
                },callback)
            }
        },
        updateOne:async ({req,res},data,file,callback,func)=>await fileStorage.updateOne({
            ...commonArgs,
            data,req,
        },callback,func),
        updateMany:async ({req,res},data,file,callback)=>{
            let errors=[]
            let result=[]
            let response={}
            if(data.files && Array.isArray(data?.files)){
                await Promise.all(data?.files?.map(async (fileInfo,i)=>{
                    return new Promise(async resolve=>{
                        const resp=await this.file.updateOne(
                            {req},
                            {
                                path:data?.path,
                                ...fileInfo
                            },
                            null,
                            callback,
                            'updateOne'
                        )
                        if(resp?.data){
                            result.push(resp.data)
                        }else {
                            errors.push(resp?.error?.message)
                        }
                        resolve()
                    })
                }))

            }else {
                errors.push({
                    message:'No files parameter found'
                })
            }
            if(errors.length>0)
                response.error=errors
            if(result.length>0)
                response.data=result

            return response
        },
        deleteOne:async ({req,res},data,file,callback,func)=>await fileStorage.deleteOne({
            ...commonArgs,
            data,req,
        },callback,func),
        deleteMany:async ({req,res},data,file,callback)=>{
            let errors=[]
            let result=[]
            let response={}
            if(data.files && Array.isArray(data?.files)){
                await Promise.all(data?.files?.map(async (file,i)=>{
                    return new Promise(async resolve=>{
                        const resp= await this.file.deleteOne(
                            {req},
                            {
                                path:data?.path,
                                uid:data.files?.[i]
                            },
                            null,
                            callback,
                            'deleteOne'
                        )
                        if(resp?.data){
                            result.push(resp.data)
                        }else {
                            errors.push(resp?.error?.message)
                        }
                        resolve()
                    })
                }))

            }else {
                errors.push({
                    message:'No files parameter found'
                })
            }
            if(errors.length>0)
                response.error=errors
            if(result.length>0)
                response.data=result

            return response
        },

    }
    folder={
        createOne:async ({req,res},data,file,callback,func)=>await folderStorage.createOne({
            ...commonArgs,
            data,req,
        },callback,func),
        createMany:async ({req,res},data,file,callback)=>{
            let errors=[]
            let result=[]
            let response={}
            if(Array.isArray(data?.folders)){
                await Promise.all(data?.folders.map(async (folder,i)=>{
                    return new Promise(async resolve=>{
                        const resp= await this.folder.createOne(
                            {req},
                            {
                                path:data?.path+'/'+data.folders?.[i],
                            },
                            null,
                            callback,
                            'createOne'

                        )
                        if(resp?.data){
                            result.push(data.folders?.[i])
                        }else {
                            errors.push(resp?.error?.message)
                        }
                        resolve()
                    })
                }))
            }else {
                errors.push({
                    message:'parameter folders should be array'
                })
            }

            if(errors.length>0)
                response.error=errors
            if(result.length>0)
                response.data=result

            return response

        },
        findOne:async ({req,res},data,file,callback,func)=>await folderStorage.findOne({
            ...commonArgs,
            data,req,res
        },callback,func),
        findMany:async ({req,res},data,file,callback)=>{
            if(Array.isArray(data?.folders)){
                let acepath=data?.path
                if(acepath.charAt(0)!=='/') acepath='/'+acepath
                const name=acepath.split('/').pop()

                let withFile
                let withDownload
                withFile=data?.withFile
                withDownload=data?.withDownload
                if(withDownload) withFile=false
                delete data.isFolder
                delete data.withFile
                delete data.withDownload
                let errors=[]
                let result=[]
                let response={}
                let files=[]
                await Promise.all(data?.folders.map(async (folder,i)=>{
                    return new Promise(async resolve=>{
                        const resp= await this.folder.findOne(
                            {req,res},
                            {
                                path:data?.path+'/'+data?.folders?.[i],
                            },
                            null,
                            callback,
                            'findOne'
                        )

                        if(resp?.data){
                            if(withDownload || withFile){
                                const uploadPath=storageDir+acepath+'/'+data?.folders?.[i]
                                files.push({path:uploadPath,name:acepath+'/'+data?.folders?.[i]})
                            }else {
                                /*console.log('path: ',data?.path+'/'+data?.folders?.[i])
                                console.log('result: ', resp.data)
                                console.log('------------')*/
                                result.push(resp.data)
                            }

                        }else {
                            errors.push(resp?.error?.message)
                        }
                        resolve()
                    })
                }))
                //console.log('result ', result)
                try {
                    if(withDownload || withFile){
                        //console.log('get folders: ', files)
                        if(files.length>0){
                            res.zip({
                                files,
                                filename:name+'.zip'
                            })
                        }

                        return {}
                    }else {
                        if(errors.length>0)
                            response.error=errors
                        if(result.length>0)
                            response.data=result

                        return response
                    }
                }catch (e) {

                }


            }else {
                await fileStorage.findOne({
                    ...commonArgs,
                    data,req,res
                },callback)
            }
        },
        updateOne:async ({req,res},data,file,callback,func)=>await folderStorage.updateOne({
            ...commonArgs,
            data,req,
        },callback,func),
        updateMany:async ({req,res},data,file,callback)=>{
            let errors=[]
            let result=[]
            let response={}
            if(data.folders && Array.isArray(data?.folders)){
                await Promise.all(data?.folders?.map(async (folder,i)=>{
                    return new Promise(async resolve=>{
                        const resp= await this.folder.updateOne(
                            {req},
                            {
                                path:data?.path+'/'+folder.name,
                                newPath:folder?.newPath
                            },
                            null,
                            callback,
                            'updateOne'
                        )
                        if(resp?.data){
                            result.push(resp.data)
                        }else {
                            errors.push(resp?.error?.message)
                        }
                        resolve()
                    })
                }))

            }else {
                errors.push({
                    message:'No files parameter found'
                })
            }
            if(errors.length>0)
                response.error=errors
            if(result.length>0)
                response.data=result

            return response
        },
        deleteOne:async ({req,res},data,file,callback,func)=>await folderStorage.deleteOne({
            ...commonArgs,
            data,req,
        },callback,func),
        deleteMany:async ({req,res},data,file,callback)=>{
            let errors=[]
            let result=[]
            let response={}
            if(data.folders && Array.isArray(data?.folders)){
                await Promise.all(data?.folders?.map(async (folder,i)=>{
                    return new Promise(async resolve=>{
                        const resp= await this.folder.deleteOne(
                            {req},
                            {
                                path:data?.path+'/'+data?.folder?.[i],
                            },
                            null,
                            callback,
                            'deleteOne'
                        )
                        if(resp?.data){
                            result.push(data?.folder?.[i])
                        }else {
                            errors.push(resp?.error?.message)
                        }
                        resolve()
                    })
                }))

            }else {
                errors.push({
                    message:'No files parameter found'
                })
            }
            if(errors.length>0)
                response.error=errors
            if(result.length>0)
                response.data=result

            return response
        }
    }

}
export {
    LocalStorageService
}