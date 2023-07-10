import SocketResponse from "../../../helpers/response-socket";
import Response from "../../../helpers/response";
import getDataFromRequest from "../../../helpers/extract-data";
const rootApi = process.env.API_PATH ||'/api/v1';
const ExpressHandler=(app,that)=>{
    app.use((req, res, next) => {
        req.authAdminToken=that.authAdminToken
        req.daynverServerUrl=that.daynverServerUrl
        req.authServerUrl=that.authServerUrl
        req.databaseServerUrl=that.databaseServerUrl
        req.mailServerUrl=that.mailServerUrl
        req.phoneServerUrl=that.phoneServerUrl
        req.storageServerUrl=that.storageServerUrl
        req.cronServerUrl=that.cronServerUrl

        req.sendMail= that.sendMail
        req.netSocket=that.netSocket

        req.io = that.io;
        req.privateSocket = that.privateSocket;
        req.publicSocket = that.publicSocket;
        req.ioJwt = that.verify
        req.ioUser = that.user
        req.eventEmitter = that.eventEmitter
        req.entitySchema=that.entitySchema
        req.mailComposer=that.mailComposer
        next()
    });
    app.get('/', (req, res) => {
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
        path=req?.originalUrl.replace(rootApi+'/','').replace(/\?.*/,'')

        if(result.error){
            response.error={}
            response.error.testAuth=result.error
            if(socket)
                socket.emit(listen+path,SocketResponse.error(response))
            Response.error(res,response,response.error.auth?.code)
        }else {
            data={
                message:'Hi, Welcome to Swyger Mailer - API!'
            }
            response.data={
                data
            }
            if(socket)
                socket.emit(listen+path,SocketResponse.success(response))
            Response.success(res, response);


        }


    });
}
export default ExpressHandler