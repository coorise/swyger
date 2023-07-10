const createOne=async (args,callback,func)=>{
    const {
        mime,fs,path,v4,glob,req,
        readdir,stat,promisify,file,data,storageDir
    }=args
    let response={}
    let fileInfo={}
    let result

    try {
        if(data?.path && file){
            let customPath

            if(data?.path.charAt(0)!=='/') data.path='/'+data?.path
            const extension=path.extname(file?.name)
            if(file?.name.includes('%%')){
                customPath=file.name.split('%%')
                if(customPath[0]==='') customPath.shift()
                const name=customPath.pop()

                customPath='/'+customPath?.reduce((prev,current)=>prev+'/'+current)
                //console.log('customPath: ', customPath)
                //console.log('name: ',name )
                fileInfo.name=(data?.name)?data?.name:name
                fileInfo.path=data?.path+customPath
            }else {
                fileInfo.name=(data?.name)?data?.name:file?.name
                fileInfo.path=data?.path
            }
            fileInfo.storage='local'
            fileInfo.uid=v4()
            fileInfo.size=file?.size
            fileInfo.isFolder=false
            fileInfo.type=mime.getType(file?.name)
            fileInfo.extension=extension
            fileInfo.downloadUrl=`/files/download/${fileInfo.uid}`
            result=await callback({
                path:fileInfo.path+'/'+fileInfo.uid,
                value:fileInfo
            },fileInfo,func)
            if(result?.error){
                response.error={
                    message:'You do not have access to write'+data?.path+'/'+file.name
                }
            }else {
                const uploadPath=storageDir+fileInfo?.path+'/'+fileInfo?.uid+extension
                fs.outputFileSync(uploadPath, file?.data)
            }


            //const data = await fs.readFile(f, 'utf8')
            //console.log(data) // => hello!
            //response.data=fileInfo
            response.data=result?.data
        }
        else {
            response.error={
                message:'No path or file found or  file is an array that should be  send with files/*/create-many'
            }
        }
    } catch (err) {
        //console.error(err)
        response.error={
            message:'We encounter an error to write  file: '+data?.path+'/'+file.name
        }
    }
    return response
}
export default createOne