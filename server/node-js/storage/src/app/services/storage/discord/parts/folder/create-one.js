
const createOne=async (args,callback,func)=>{
    const {
        mime,fs,path,v4,glob,req,
        readdir,stat,promisify,
        data,storageDir
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
            if(fs.pathExistsSync(uploadPath)){
                response.error={
                    message:'The folder already exist: '+acepath
                }
            }else {
                folderInfo.storage='local'
                folderInfo.path=data?.path
                folderInfo.uid=v4()
                folderInfo.name=acepath.split('/').pop()
                folderInfo.size=0
                folderInfo.isFolder=true
                folderInfo.downloadUrl=`/folders/download/${folderInfo.uid}`

                result=await callback({
                    path:acepath,
                    value: {}
                },folderInfo,func)
                if(result?.error){
                    response.error={
                        message:'You do not have access to write'+acepath
                    }
                }else if(result.data){
                    response.data=result?.data
                }else {
                    response.error={
                        message:'You do not have access to write'+acepath
                    }
                }

                //response.data=folderInfo

            }

        }
        else {
            response.error={
                message:'No path for folder found: '+acepath
            }
        }
        //const data = await fs.readFile(f, 'utf8')
        //console.log(data) // => hello!
    } catch (err) {
        //console.error(err)
        response.error={
            message:'We encounter an error to write: '+acepath
        }
    }
    return response
}
export default createOne