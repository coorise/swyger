import axios from "axios";
import FormData from "form-data";
import { wait } from "../utils/time.js";
import {AsyncStreamProcessor} from "../utils/stream.js";
import {Readable,} from "stream";


const client = axios.create();

// Discord has a rate limit of 5 requests / 5 seconds
// So we must queue the upload
let uploadingCount = 0;
const defaultToken = process.env.DISCORD_BOT_TOKEN;
let defaultChannelId = process.env.DISCORD_CHANNEL_ID;

const getBufferToDiscord = async (clientToken,req,archive,file)=>{
    let token=clientToken||defaultToken
    let socket=req?.publicSocket

    if(file.parts.length>0){
        const readableStream = new Readable()
        readableStream._read = function () {}
        for (const part of file.parts) {
            const i = file.parts.indexOf(part)
            // Discord CDN supports range, so we will use that to chunk the file first
            const headers =
                part.start || part.end
                    ? { Range: `bytes=${part.start || 0}-${part.end || ""}` }
                    : {};
            headers.Authorization=`Bot ${token}`

            try {
                console.log('filename: ',file?.name)
                let response=await axios
                    .get(part.url, { headers, responseType: "stream" })
                const stream=response.data
                stream.on('data',(chunk)=>{
                    try {
                        //chunks+=chunk
                        readableStream.push(chunk)
                        //console.log('get buffer: ',chunk)
                    }catch (e) {

                    }

                })
                stream.on("end", () => {
                    if(file.parts.length===i+1){
                        readableStream.push(null);
                    }
                })
            }
            catch (e) {

            }

        }
        archive?.append(readableStream, {
            name: file?.path+'/'+file?.uid+'-'+file?.name,
        })

    }
}
const broadcastToDiscord = async (clientToken,req,part,name)=>{
    let token=clientToken||defaultToken
    let socket=req.publicSocket
    // Discord CDN supports range, so we will use that to chunk the file first
    const headers =
        part.start || part.end
            ? { Range: `bytes=${part.start || 0}-${part.end || ""}` }
            : {};
    headers.Authorization=`Bot ${token}`
    await new Promise((resolve, reject) => {
        axios
            .get(part.url, { headers, responseType: "stream" })
            .then((response) => {
                response.data.on('data',(chunk)=>{
                    //console.log('broadcastFile: ',chunk)
                    socket?.emit(req.listenExtrasPath,{data:{name,chunk}})
                })
                response.data.on("error", (err) => reject(err));
                response.data.on("end", () => resolve());
            }).catch(()=>{});
    });
}
const fetchToDiscord = async (clientToken,res,part)=>{
    let token=clientToken||defaultToken
  // Discord CDN supports range, so we will use that to chunk the file first
  const headers =
    part.start || part.end
        ? { Range: `bytes=${part.start || 0}-${part.end || ""}` }
        : {};
    headers.Authorization=`Bot ${token}`
  await new Promise((resolve, reject) => {
    axios
        .get(part.url, { headers, responseType: "stream" })
        .then((response) => {
          response.data.pipe(
              new AsyncStreamProcessor(async (data) => {
                if (!res.write(data))
                  await new Promise((r) => res.once("drain", r));
              })
          );
          response.data.on("error", (err) => reject(err));
          response.data.on("end", () => resolve());
        }).catch(()=>{});
  });
}
const deleteToDiscord = async (clientToken,clientChannelId,messageId)=>{
    let token=clientToken||defaultToken
    let channelId=clientChannelId||defaultChannelId
    await wait(uploadingCount++ * 1000);
    const result =(
        await client
            .delete(
                `https://discord.com/api/channels/${channelId}/messages/${messageId}`,
                {
                    headers: {
                        Authorization: `Bot ${token}`,
                    },
                }
            )

            .catch(async (err) => {

                /*console.log("error from discord", err.code,
                    //err.response?.headers ,
                err.response?.data)
                console.log('___________________________________')*/

                // The error with code ERR_BAD_REQUEST when not existing
                if(err.code==='ERR_BAD_REQUEST') return {data:false}
                // Auto retry if the request is rate limited recursively
                await wait(+err.response.headers["x-ratelimit-reset-after"]);

                return {
                    data:await deleteToDiscord(token,channelId,messageId)
                }

            })
            .finally(() => uploadingCount--)
    ).data

    return result

}
const uploadToDiscord = async (clientToken, clientChannelId, file, fileName,fileInfo) => {
  let token=clientToken||defaultToken
  let channelId=clientChannelId||defaultChannelId
  await wait(uploadingCount++ * 1000);

  const formData = new FormData();

  formData.append("files[0]", file, { filename: fileName });
  formData.append("content", JSON.stringify(fileInfo,null, 2));

  const result = (
    await client
      .post(
        `https://discord.com/api/channels/${channelId}/messages`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bot ${token}`,
          },
        }
      )
      .catch(async (err) => {
          // The error with code ERR_BAD_REQUEST when not existing
          if(err.code==='ERR_BAD_REQUEST') return {data:false}

        // Auto retry if the request is rate limited recursively
        await wait(+err.response.headers["x-ratelimit-reset-after"]);
        return {
          data:await uploadToDiscord(token, channelId, file, fileName)

        };
      })
      .finally(() => uploadingCount--)
  ).data;

  /*if (!result?.attachments?.[0]?.url) {
    //throw new Error("Cannot find attachments when uploading");
  }*/
    //console.log('File for detail ', result)
    //console.log('File for attachment ', result?.attachments?.[0])

  return result;
};

export {
    fetchToDiscord,
    deleteToDiscord,
    uploadToDiscord,
    getBufferToDiscord,
    broadcastToDiscord
}
