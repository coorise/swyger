const deleteOne=async (args,callback,func)=>{
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

        if(acepath){
            const uploadPath=storageDir+acepath
            folderInfo.storage='local'
            folderInfo.uid=data?.uid
            folderInfo.path=data?.path

            delete data.path
            delete data.isFolder
            result=await callback({
                path:acepath,
                //value:(Object.keys(data)?.length>0)?data:undefined
            },folderInfo,'findOne')

            if(result?.error){
                response.error={
                    message:'You do not have access to read folder: '+acepath
                }
            }else if(result?.data) {
                let access=await callback({
                    path:acepath,
                    //value:(Object.keys(data)?.length>0)?data:undefined
                },folderInfo,func)
                if(access?.data){
                    response.data=result?.data
                    //console.log('folder path: ',glob.sync(uploadPath+'.*',{dot: true})?.[0])
                    if(fs.pathExistsSync(uploadPath)){
                        fs.removeSync(uploadPath)
                    }
                }else {
                    response.error={
                        message:'You do not have access to delete folder: '+acepath
                    }
                }


            }else {
                response.error={
                    message:'The folder does not exist: '+acepath
                }
            }


        }
        else {
            response.error={
                message:'No  path found: '+acepath
            }
        }
    } catch (err) {
        //console.error(err)
        response.error={
            message:'We encounter an error to delete  folder: '+acepath
        }
    }
    return response
}
export default deleteOne