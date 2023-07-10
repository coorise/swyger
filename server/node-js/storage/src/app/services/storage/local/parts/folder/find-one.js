import { Blob,  } from 'buffer';
import zipper from 'zip-local'
import {promisify} from "util";
import {pipeline} from "stream";
import {stat} from "fs";
const fsInfo=promisify(stat)

const findOne=async (args,callback,func)=>{
    const {
        mime,fs,path,v4,glob,req,res,
        readdir,promisify,folder,data,storageDir
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
                const uploadPath=storageDir+acepath
                const name=acepath.split('/').pop()
                const uploadTempPath='temp'+acepath+'/'+name+'.zip'
                try {
                    if(withDownload){
                        //visit: https://www.npmjs.com/package/express-easy-zip
                        res.zip({
                            files:[
                                {path:uploadPath,name:acepath}
                            ],
                            filename:name+'.zip'
                        })
                        //fs.removeSync('temp/'+rootPath+'/')
                        return  {}
                    }else
                    if(fs.pathExistsSync(uploadPath)){


                        if(!fs.pathExistsSync('temp'+acepath)) fs.mkdirsSync('temp'+acepath)
                        zipper.sync.zip(uploadPath).compress().save(uploadTempPath);

                        if(fs.pathExistsSync(uploadTempPath)){
                            //console.log('upload path: ', uploadTempPath)
                            //let buffer=await fs.readFile(uploadTempPath,)
                            //bufferFile=new Blob([Buffer.from(buffer)],{
                            //    type:mime.getType(uploadTempPath)
                            //})
                            const { size } = await fsInfo(uploadTempPath);
                            const rootPath=acepath.split('/').shift()


                            //visit: https://www.webmound.com/download-file-using-express-nodejs-server/
                            res.writeHead(200, {
                                //"Content-Disposition":`attachment; filename="${result?.data?.name}"`, //open download
                                "Content-Disposition":`inline; filename="${name}.zip"`, //read file directly in browser
                                "Content-Length": size,
                                "Content-Type": mime.getType(name+'.zip')
                            });

                            let readable = fs.createReadStream(uploadTempPath);
                            pipeline(readable, res, err => {
                                //console.log(err);
                            });
                            //When many users will request the same file, better keep the file,
                            //the do a cron job to delete it maybe in 1h/1d/1w

                            fs.removeSync('temp/'+rootPath+'/')

                            return {}
                        }

                    }
                }catch (e) {
                    console.log('download File: ', e)
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