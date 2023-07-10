import {deleteToDiscord} from "../../../discord/api";

const deleteOne=async (args,callback,func)=>{
    const {
        mime,fs,path,v4,glob,req,
        readdir,stat,promisify,data,storageDir,config
    }=args
    let response={}
    let fileInfo={}
    let result
    try {
        if(data?.path && data?.uid){
            if(data?.path.charAt(0)!=='/') data.path='/'+data?.path

            fileInfo.storage='local'
            fileInfo.uid=data?.uid
            fileInfo.path=data?.path

            result=await callback({
                path:fileInfo.path,
                value:{
                    uid:fileInfo.uid
                }
            },fileInfo,'findOne')

            if(result?.error){
                response.error={
                    message:'You do not have access to read file: '+data?.path+'/'+fileInfo.uid
                }
            }else if(result?.data?.uid) {
                let access=await callback({
                    path:fileInfo.path+'/'+result?.data?.uid+'/isFolder',
                },fileInfo,func)
                if(access?.data){

                    response.data=result?.data
                    let info=result?.data
                    if(Array.isArray(info?.parts)){
                        //console.log('file detail ',info.parts)
                        const arrayPromise=info?.parts.map(async (file)=> {
                            return await new Promise(async (resolve)=>{
                                const messageId=file.messageId
                                await deleteToDiscord(config?.token,config?.channelId,messageId)
                                resolve('')
                            })
                        })
                        await Promise.all(arrayPromise)
                        await callback({
                            path:fileInfo.path+'/'+result?.data?.uid
                        },fileInfo,func)

                    }
                }else {
                    response.error={
                        message:'You do not have access to delete file: '+data?.path+'/'+fileInfo.uid
                    }
                }

            }else {
                response.error={
                    message:'File does not exist: '+data?.path+'/'+fileInfo.uid
                }
            }
        }
        else {
            response.error={
                message:'No uid or path found: '+data?.path+'/'+data.uid
            }
        }
    } catch (err) {
        //console.error(err)
        response.error={
            message:'We encounter an error to delete  file: '+data?.path+'/'+data.uid
        }
    }
    return response
}
export default deleteOne