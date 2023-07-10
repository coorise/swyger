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
import * as discord from './api'
import archiver from 'archiver'
import FormData from "form-data";
import {getBufferToDiscord} from "./api";
import getPath from "./utils/path-list";

const storageDir=process.env.STORAGE_DIR||'storage' //from your root project
fs.move=move
const commonArgs={
    mime,fs,path,v4,glob,readdir,
    stat,promisify,
    storageDir,
    discord
}
class DiscordStorageService{
    file={
        createOne:async ({req,res,config},data,file,callback,func)=>{
            /*return await fileStorage.createOne({
                ...commonArgs,
                file:(file)?file:(!Array.isArray(req.files?.file))?req.files?.file:undefined,
                data,req,res,config
                ,
            },callback,func)*/
            return {
                error:{
                    message:'Not the correct route, instead, you should upload your file with https:[host]:/storage/upload'
                }
            }
        },
        createMany:async ({req,res,config},data,file,callback)=>{
            /*let errors=[]
            let result=[]
            let response={}
            if(Array.isArray(req?.files?.file)){
                await Promise.all(req?.files?.file.map(async (file,i)=>{
                    return new Promise(async resolve=>{
                        const resp= await this.file.createOne(
                            {req,config},
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
        findOne:async ({req,res,config},data,file,callback,func)=>await fileStorage.findOne({
            ...commonArgs,
            data,req,res
        },callback,func),
        findMany:async ({req,res,config},data,file,callback)=>{
            if(Array.isArray(data?.files)){
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
                                //files.push({file:resp.data})
                                return {
                                    error:{
                                        message:'Not the correct route, instead, you should download one file at a time for the moment  with https:[host]:/storage/**/download-one'
                                    }
                                }
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
                        /*if(files.length>0){
                            const archive = archiver('zip',{
                                zlib: { level: 9 }
                            });
                            const name=acepath.split('/').pop()
                            //set the archive name
                            res.attachment(name+'.zip');
                            archive.pipe(res)
                            for(let path of files){
                                if(file.data?.storage==='discord'){
                                    if(file.data?.parts?.length>0){
                                        file=file.data
                                        await getBufferToDiscord(config?.token,req, archive,file)
                                    }
                                }
                            }
                            await archive.finalize()
                        }
                        else {
                            return {
                                error:{
                                    message:'No files found!'
                                }
                            }
                        }
                        return {}*/
                        return {
                            error:{
                                message:'Not the correct route, instead, you should download file at a time  with https:[host]:/storage/**/download-one'
                            }
                        }
                    }
                    else {
                        if(errors.length>0)
                            response.error=errors
                        if(result.length>0)
                            response.data=result

                        return response
                    }
                }catch (e) {

                }


            }
            else {
                await fileStorage.findOne({
                    ...commonArgs,
                    data,req,res
                },callback)
            }
        },
        updateOne:async ({req,res,config},data,file,callback,func)=>await fileStorage.updateOne({
            ...commonArgs,
            data,req,config
        },callback,func),
        updateMany:async ({req,res,config},data,file,callback)=>{
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
        deleteOne:async ({req,res,config},data,file,callback,func)=>await fileStorage.deleteOne({
            ...commonArgs,
            data,req,config
        },callback,func),
        deleteMany:async ({req,res,config},data,file,callback)=>{
            let errors=[]
            let result=[]
            let response={}
            if(data.files && Array.isArray(data?.files)){
                await Promise.all(data?.files?.map(async (fileInfo,i)=>{
                    return new Promise(async resolve=>{
                        const resp= await this.file.deleteOne(
                            {req,config},
                            {
                                path:data?.path,
                                ...fileInfo
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
        createOne:async ({req,res,config},data,file,callback,func)=>await folderStorage.createOne({
            ...commonArgs,
            data,req,config
        },callback,func),
        createMany:async ({req,res,config},data,file,callback)=>{
            let errors=[]
            let result=[]
            let response={}
            if(Array.isArray(data?.folders)){
                await Promise.all(data?.folders.map(async (folder,i)=>{
                    return new Promise(async resolve=>{
                        const resp= await this.folder.createOne(
                            {req,config},
                            {
                                path:data?.path+'/'+folder?.name,
                            },
                            null,
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
                    message:'parameter folders should be array'
                })
            }

            if(errors.length>0)
                response.error=errors
            if(result.length>0)
                response.data=result

            return response

        },
        findOne:async ({req,res,config},data,file,callback,func)=>await folderStorage.findOne({
            ...commonArgs,
            data,req,res,config
        },callback,func),
        findMany:async ({req,res,config},data,file,callback)=>{
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
                let folders=[]
                await Promise.all(data?.folders.map(async (folder,i)=>{
                    return new Promise(async resolve=>{
                        const resp= await this.folder.findOne(
                            {req,res,config},
                            {
                                path:data?.path+'/'+data?.folders?.[i],
                            },
                            null,
                            callback,
                            'findOne'
                        )

                        if(resp?.data){
                            if(withDownload || withFile){
                                //folders.push({folder:resp.data})
                                return {
                                    error:{
                                        message:'Not the correct route, instead, you should download one file at a time for the moment  with https:[host]:/storage/**/download-one'
                                    }
                                }
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
                        //console.log('get folders: ', folders)
                        /*if(folders.length>0){
                            const archive = archiver('zip',{
                                zlib: { level: 9 }
                            });
                            const name=acepath.split('/').pop()
                            //set the archive name
                            res.attachment(name+'.zip');
                            archive.pipe(res)
                            folders.map(async (folder)=>{
                                let files=getPath(folder)
                                files.map(async (path)=>{
                                    let file=await callback({
                                        path:acepath+'/'+path,

                                    },{},'findOne')
                                    if(file.data?.storage==='discord'){
                                        if(file.data?.parts?.length>0){
                                            file=file.data
                                            await getBufferToDiscord(config?.token,req, archive,file)
                                        }
                                    }

                                })
                            })
                            await archive.finalize();
                        }
                        else {
                            return {
                                error:{
                                    message:'No folders found!'
                                }
                            }
                        }
                        return {}*/
                        return {
                            error:{
                                message:'Not the correct route, instead, you should download file at a time  with https:[host]:/storage/**/download-one'
                            }
                        }
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
        updateOne:async ({req,res,config},data,file,callback,func)=>await folderStorage.updateOne({
            ...commonArgs,
            data,req,
        },callback,func),
        updateMany:async ({req,res,config},data,file,callback)=>{
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
        deleteOne:async ({req,res,config},data,file,callback,func)=>await folderStorage.deleteOne({
            ...commonArgs,
            data,req,config
        },callback,func),
        deleteMany:async ({req,res,config},data,file,callback)=>{
            let errors=[]
            let result=[]
            let response={}
            if(data.folders && Array.isArray(data?.folders)){
                await Promise.all(data?.folders?.map(async (folder,i)=>{
                    return new Promise(async resolve=>{
                        const resp= await this.folder.deleteOne(
                            {req,config},
                            {
                                path:data?.path+'/'+folder?.name,
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
        }
    }

}
export {
    DiscordStorageService
}