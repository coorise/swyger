import {promisify} from "util";
import {stat} from "fs";
import {broadcastToDiscord, fetchToDiscord} from "../../api";
const fsInfo=promisify(stat)
const RANGE_SIZE = 5242880; // 5 MB
const findOne=async (args,callback,func)=>{
    const {
        mime,fs,path,v4,glob,req,res,
        readdir,promisify,file,data,storageDir,config
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
                    let info=result?.data
                    let disposition='inline'
                    try {
                        if(withDownload) disposition='attachment'


                        if(!broadcastFile){
                            res.setHeader("Content-Length", info.fileSize);
                            res.setHeader("Accept-Ranges", "bytes");
                            res.setHeader(
                                "Content-Disposition",
                                `${disposition}; filename="${info.name}"`
                            )
                            res.contentType(info.name.split(".").slice(-1)[0]);
                        }

                        //visit: https://github.com/phoenixinfotech1984/node-content-range/blob/master/server.js
                        /** Check for Range header */
                        const range = req.headers?.range||rangeM;
                        const start = range ? +range.split("=")[1].split("-")[0] : null;

                        const end = range
                            ? +range.split("=")[1].split("-")[1]
                                ? +range.split("=")[1].split("-")[1]
                                : start + RANGE_SIZE >= info.fileSize - 1
                                    ? info.fileSize - 1
                                    : start + RANGE_SIZE
                            : null;

                        const partsToDownload = range
                            ? (() => {
                                const startPartNumber = Math.ceil(start / info.chunkSize)
                                    ? Math.ceil(start / info.chunkSize) - 1
                                    : 0;
                                const endPartNumber = Math.ceil(end / info.chunkSize);

                                const partsToDownload = info.parts
                                    .map((part) => ({ url: part.url }))
                                    .slice(startPartNumber, endPartNumber);

                                partsToDownload[0].start = start % info.chunkSize;
                                partsToDownload[partsToDownload.length - 1].end =
                                    end % info.chunkSize;
                                if(!broadcastFile){
                                    res.status(206);
                                    res.setHeader("Content-Length", end - start + 1);
                                    res.setHeader(
                                        "Content-Range",
                                        `bytes ${start}-${end}/${info.fileSize}`
                                    );
                                }

                                return partsToDownload;
                            })()
                            : info.parts.map((part) => ({ url: part.url }));

                        if(broadcastFile){
                            let name=result?.data?.name
                            for (const part of partsToDownload) {
                                //socket to broadcast
                                await broadcastToDiscord(config?.token, req, part, name)
                            }
                        }else {
                            for (const part of partsToDownload) {
                                await fetchToDiscord(config?.token,res,part)
                            }

                            res.end();
                        }

                        return {}


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