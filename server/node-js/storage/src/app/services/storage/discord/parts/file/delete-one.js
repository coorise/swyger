const deleteOne=async (args,callback,func)=>{
    const {
        mime,fs,path,v4,glob,req,
        readdir,stat,promisify,data,storageDir
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
                    path:fileInfo.path+'/'+result?.data?.uid,
                },fileInfo,func)
                if(access?.data){

                    response.data=result?.data
                    const uploadPath=storageDir+fileInfo?.path+'/'+fileInfo?.uid+result?.data?.extension
                    //console.log('file path: ',glob.sync(uploadPath+'.*',{dot: true})?.[0])
                    if(fs.pathExistsSync(uploadPath))
                        fs.removeSync(uploadPath)
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