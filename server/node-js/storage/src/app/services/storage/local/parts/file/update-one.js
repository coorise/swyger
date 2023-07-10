const updateOne=async (args,callback,func)=>{
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

            fileInfo.uid=data?.uid
            fileInfo.path=data?.path
            fileInfo.name=data?.name
            fileInfo.downloadUrl=data?.downloadUrl
            result=await callback({
                path:data?.path+'/'+fileInfo.uid,
                newPath:data?.newPath,
                value: fileInfo
            },fileInfo,func)
            if(result?.error){
                response.error={
                    message:'You do not have access to write: '+data?.path+'/'+data.uid
                }
            }else if(result?.data) {
                response.data=result?.data
            }else {
                response.error={
                    message:'You do not have access to write: '+data?.path+'/'+data.uid
                }
            }


            //const data = await fs.readFile(f, 'utf8')
            //console.log(data) // => hello!
            //response.data=fileInfo

        }
        else {
            response.error={
                message:'No path or uid found: '+data?.path+'/'+fileInfo.uid
            }
        }
    } catch (err) {
        //console.error(err)
        response.error={
            message:'We encounter an error to write  file: '+data?.path+'/'+data.uid
        }
    }
    return response
}
export default updateOne