import { Blob,  } from 'buffer';
import zipper from 'zip-local'
import {promisify} from "util";
import {pipeline} from "stream";
import {stat} from "fs";

import {getBufferToDiscord} from "../../api";
import getPath from "../../utils/path-list";
import archiver from 'archiver'
const fsInfo=promisify(stat)

const findOne=async (args,callback,func)=>{
    const {
        mime,fs,path,v4,glob,req,res,
        readdir,promisify,folder,data,storageDir,config
    }=args
    let response={}
    let folderInfo={}
    let result
    let acepath=data?.path
    if(acepath.charAt(0)!=='/') acepath='/'+acepath
    if(data?.name) acepath=acepath+'/'+data?.name

    let withFile
    let withDownload
    withFile=data?.withFile
    withDownload=data?.withDownload
    delete data.isFolder
    delete data.withFile
    delete data.withDownload
    try {

        if(data?.path){
            delete data.path
            result=await callback({
                path:acepath,
                value:{
                    $option:data?.$option
                }
            },folderInfo,func)
            if(result?.error){
                response.error={
                    message:'You do not have access to read '+acepath
                }
            }


            //const data = await fs.readFile(f, 'utf8')
            //console.log(data) // => hello!
            //response.data=folderInfo
            if(withFile && result?.data){
                //visit: https://gist.github.com/yourtion/9332064324ef23c4a174f1b8853b54a6
               /* try {

                    let files=getPath(result?.data)
                    const archive = archiver('zip',{
                        zlib: { level: 9 }
                    });
                    const name=acepath.split('/').pop()
                    //set the archive name
                    res.attachment(name+'.zip');
                    archive.pipe(res)
                    for(let path of files){
                        let file=await callback({
                            path:acepath+'/'+path,
                        },folderInfo,'findOne')
                        if(file.data?.storage==='discord'){
                            if(file.data?.parts?.length>0){
                                file=file.data
                                await getBufferToDiscord(config?.token,req, archive,file)
                            }
                        }
                    }
                    await archive.finalize();


                    return {}
                }catch (e) {
                    console.log('Error with download Folder: ', e)
                }*/
                return {
                    error:{
                        message:'Not the correct route, instead, you should download one file at a time for the moment  with https:[host]:/storage/**/download-one'
                    }
                }

            }
            response.data=result?.data
        }
        else {
            response.error={
                message:'No path found: '+acepath
            }
        }
    } catch (err) {
        console.error('download err: ',err)
        response.error={
            message:'We encounter an error to write  folder: '+acepath
        }
    }

    return response
}
export default findOne