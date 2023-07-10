import {AceBaseServer} from "acebase-server";
import coreAPI from "../../../rest/core";
import sendRequestedEmail from "../../../services/mail";
const AceServer=(config)=>{
    return {
        start:()=>{
            const options={
                ...config.options,
                //email: { send: sendRequestedEmail }
            }
            const server = new AceBaseServer(config.dbName,options );
            server.on("ready", () => {
                //console.log("Auth SERVER is running on: ",config?.options.host,':',config?.options.port);
                coreAPI(server)
            });
            //console.log('acebase: ',server)



        }
    }
}
export default AceServer