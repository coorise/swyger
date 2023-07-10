import {AceBaseClient} from "acebase-client";

const acebaseClient={
    init:()=>{
       return new AceBaseClient(
           {
               host: process.env.ACE_HOST||'localhost',
               port: process.env.ACE_PORT||3100,
               dbname: process.env.ACE_NAME||'swyger',
               https:false //process env not working
           }
       )
    }
}
export default acebaseClient