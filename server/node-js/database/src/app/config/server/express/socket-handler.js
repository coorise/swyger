import SocketResponse from "../../../helpers/response-socket";
import getDataFromRequest from "../../../helpers/extract-data";
const rootApi = process.env.API_PATH ||'/api/v1';
const SocketHandler=(that)=>{
    that.socketRouter.use((req, res, next) => {
        req.authAdminToken=that.authAdminToken
        req.daynverServerUrl=that.daynverServerUrl
        req.authServerUrl=that.authServerUrl
        req.databaseServerUrl=that.databaseServerUrl
        req.mailServerUrl=that.mailServerUrl
        req.phoneServerUrl=that.phoneServerUrl
        req.storageServerUrl=that.storageServerUrl
        req.cronServerUrl=that.cronServerUrl

        req.io = that.io;
        req.privateSocket = that.privateSocket;
        req.publicSocket = that.publicSocket;
        req.ioJwt = that.verify
        req.ioUser = that.user
        req.eventEmitter = that.eventEmitter
        req.entitySchema=that.entitySchema

        req.acebaseClient=that.acebaseClient
        next()
    })
    that.socketRouter.use('/', (req, res) => {
        let response={}
        let socket=req.publicSocket
        let listen=rootApi+'/on/'
        let data = getDataFromRequest(req)
        const result={}
        let path=''

        if(!data?.socket){
            result.error={
                code:400,
                message:'You did not set your Json request correctly, it should be data={socket,data}'
            }
        }
        path=req?.path.replace(rootApi+'/','').replace(/\?.*/,'')

        if(typeof data=='object' && data?.socket?.isPrivate){
            listen=listen+data?.socket?.socketId+'/'
        }

        if(socket){
            if(result.error){
                response.error={}
                response.error.testAuth=result.error
                socket.emit(listen+path,SocketResponse.error(response))
            }else {
                data={
                    message:'Hi, Welcome to Swyger Data - API!'
                }
                response.data={
                    data
                }
                socket.emit(listen+path,SocketResponse.success(response))

            }

        }

    });
}
export default SocketHandler