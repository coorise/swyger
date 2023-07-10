const updateOne=async (args,callback,func)=>{
    const {
        mime,fs,path,v4,glob,req,
        readdir,stat,promisify,data,storageDir
    }=args
    let response={}
    let folderInfo={}
    let result
    let acepath=data?.path
    if(acepath.charAt(0)!=='/') acepath='/'+acepath
    if(data?.name) acepath=acepath+'/'+data?.name
    try {
        //if(data?.path && data?.uid){

        if(data?.path){
            const uploadPath=storageDir+acepath
            folderInfo.uid=data?.uid
            folderInfo.path=data?.path
            folderInfo.name=acepath.split('/').pop()
            folderInfo.downloadUrl=data?.downloadUrl
            result=await callback({
                path:acepath,
                newPath:data?.newPath,
                value: {}
            },folderInfo,func)
            if(result?.error){
                response.error={
                    message:'You do not have access to write: '+acepath
                }
            }else if(result.data) {
                response.data=result?.data
                if(data?.newPath){
                    if(data?.newPath.charAt(0)!=='/') data.newPath='/'+data?.newPath
                    const newUploadPath=storageDir+data?.newPath
                    //console.log('old path: ',uploadPath)
                    //console.log('folder new path: ',newUploadPath)
                    if(fs.pathExistsSync(uploadPath)){
                        if(!fs.pathExistsSync(newUploadPath))
                            fs.mkdirsSync(newUploadPath)
                        await fs.move(uploadPath,newUploadPath,{merge:true})
                    }

                }

            }else {
                response.error={
                    message:'You do not have access to write: '+acepath
                }
            }

            //const data = await fs.readFile(f, 'utf8')
            //console.log(data) // => hello!
            //response.data=folderInfo

        }
        else {
            response.error={
                message:'No path found: '+acepath
            }
        }
    } catch (err) {
        //console.error(err)
        response.error={
            message:'We encounter an error to write  folder: '+acepath
        }
    }
    return response
}
export default updateOne