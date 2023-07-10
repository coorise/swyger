// @ts-nocheck
import 'module-alias/register';
import './module-alias'
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand'
dotenvExpand.expand(dotenv.config())
import AceServer from "./app/config/server/ace-base";
const ace={
    user:process.env.ACE_USER,
    pass:process.env.ACE_PASS
}
const setting={
    dbName:process.env.ACE_NAME||'swyger',
    options:{
        host: process.env.ACE_HOST||'localhost',
        port: 3100, // env not working for port, they have to fix this bug
        /*https: {
            certPath: './mycertificate.pem',
            keyPath: './myprivatekey.pem'
        },*/
        //logLevel: 'log', // log|warn|verbose|error
        //log:false,
        path: process.env.ACE_STORAGE_PATH||'./database',
        transactions: {
            log: true,      // Enable
            maxAge: 30,     // Keep logs of last 30 days
            noWait: false   // Data changes wait for log to be written
        },
        authentication: {
            enabled: true,
            allowUserSignup: true,
            defaultAccessRule: 'auth',
            defaultAdminPassword: ace.pass
        }
    }
}
console.log(`Server Environment Mode:`, process.env?.NODE_ENV);
AceServer(setting).start()