import {promisify} from "util";
import {stat} from "fs";
import {pipeline} from "stream";
const fsInfo=promisify(stat)

const findOne=async (args,callback,func)=>{
    const {
        mime,fs,path,v4,glob,req,res,
        readdir,promisify,file,data,storageDir
    }=args

    let response={}
    let fileInfo={}
    let result
    let withFile
    let withDownload
    let broadcastFile
    let rangeM
    withFile=data?.withFile
    rangeM=data?.range
    withDownload=data?.withDownload
    broadcastFile=data?.broadcastFile
    delete data.isFolder
    delete data.range
    delete data.withFile
    delete data.withDownload
    delete data.broadcastFile

    try {
        if(data?.path){
            if(data?.path.charAt(0)!=='/') data.path='/'+data?.path

            let acepath=data.path

            delete data.path
            result=await callback({
                path:acepath,
                value:(Object.keys(data)?.length>0)?data:undefined
            },fileInfo,func)
            if(result?.error){
                response.error={
                    message:'You do not have access to read: '+data?.path
                }
            }

            //const data = await fs.readFile(f, 'utf8')
            //console.log('result file: ', result) // => hello!
            //response.data=fileInfo

            if(withFile && result?.data?.uid){
                const uploadPath=storageDir+result.data?.path+'/'+result.data.uid+result.data?.extension
                if(fs.pathExistsSync(uploadPath)){
                    const { size } = await fsInfo(uploadPath);
                    let disposition='inline'
                    try {
                        if(withDownload) disposition='attachment'

                        //visit: https://github.com/phoenixinfotech1984/node-content-range/blob/master/server.js
                        /** Check for Range header */
                        const range = req.headers?.range||rangeM;
                        if (range) {
                            /** Extracting Start and End value from Range Header */
                            let [start, end] = range.replace(/bytes=/, "").split("-");
                            start = parseInt(start, 10);
                            end = end ? parseInt(end, 10) : size - 1;

                            if (!isNaN(start) && isNaN(end)) {
                                start = start;
                                end = size - 1;
                            }
                            if (isNaN(start) && !isNaN(end)) {
                                start = size - end;
                                end = size - 1;
                            }



                            if(broadcastFile){
                                let socket=req.publicSocket
                                let name=result?.data?.name
                                let readable = fs.createReadStream(uploadPath, { start: start, end: end });
                                //visit: https://blog.takeer.com/streaming-binary-data-using-socket-io/
                                readable.on('data',(chunk)=>{
                                    //console.log('broadcastFile: ',chunk)
                                    socket.emit(req.listenExtrasPath,{data:{name,chunk}})
                                })
                            }else {
                                // Handle unavailable range request
                                if (start >= size || end >= size) {
                                    // Return the 416 Range Not Satisfiable.
                                    res.writeHead(416, {
                                        "Content-Range": `bytes */${size}`
                                    });
                                    return res.end();
                                }
                                /** Sending Partial Content With HTTP Code 206 */
                                res.writeHead(206, {
                                    "Content-Disposition":`${disposition}; filename="${result?.data?.name}"`,
                                    "Content-Range": `bytes ${start}-${end}/${size}`,
                                    "Accept-Ranges": "bytes",
                                    "Content-Length": end - start + 1,
                                    "Content-Type": mime.getType(result?.data?.name)
                                });
                                let readable = fs.createReadStream(uploadPath, { start: start, end: end });
                                pipeline(readable, res, err => {
                                    //console.log(err);
                                });
                            }

                            return  {}

                        }
                        else {
                            if(broadcastFile){
                                let socket=req.publicSocket
                                let name=result?.data?.name
                                //visit: https://blog.takeer.com/streaming-binary-data-using-socket-io/
                                let readable = fs.createReadStream(uploadPath);
                                readable.on('data',(chunk)=>{
                                    //console.log('broadcastFile: ',chunk)
                                    socket.emit(req.listenExtrasPath,{data:{name,chunk}})
                                })
                            }else {
                                //console.log('result file: ', uploadPath)
                                //visit: https://stackoverflow.com/questions/56652397/res-download-working-with-html-form-submit-but-not-an-axios-post-call
                                //res.download(uploadPath,result.data.name)

                                //visit: https://www.webmound.com/download-file-using-express-nodejs-server/
                                res.writeHead(200, {
                                    //"Content-Disposition":`attachment; filename="${result?.data?.name}"`, //open download
                                    "Content-Disposition":`${disposition}; filename="${result?.data?.name}"`, //read file directly in browser
                                    "Content-Length": size,
                                    "Content-Type": mime.getType(result?.data?.name)
                                });
                                let readable = fs.createReadStream(uploadPath);
                                pipeline(readable, res, err => {
                                    //console.log(err);
                                });
                            }

                            return {}
                        }


                    }catch (e) {

                    }
                }else {
                    response.error={
                        message:'The file does not exist on the disk!: '+result?.data?.name

                    }
                }


            }
            response.data=result?.data
        }
        else {
            response.error={
                message:'No path found'
            }
        }
    } catch (err) {
        //console.error(err)
        response.error={
            message:'We encounter an error to find  file: '+data?.path
        }
    }
    return response
}
export default findOne