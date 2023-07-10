import 'module-alias/register';
import './module-alias'
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand'
import http from 'http';
import App from '@config/server/express';// the actual Express app

import * as socket from './app/services/notification/socket-io/socket.service'
import * as socket_client from './app/services/notification/socket-io/socket-client.service'

dotenvExpand.expand(dotenv.config())

//Custom IMAP(incoming) and SMTP (outgoing) server
/*import NodeMailerServer from "./app/services/mail/server";

NodeMailerServer.init(
    {
      port:process.env.MAIL_PORT,
      host:process.env.MAIL_HOST,
    }
)*/

global.eventEmitter=''



const PORT = process.env.PORT || 4200;
const HOST = process.env.HOST || '0.0.0.0';

let appModule = new App()

//To create ssl certificate with Let's Encrypt, use greenlock-express
//Note: geenlock v3+ has changed , so we downgraded to 2.7 to use middleware
//visit: https://git.coolaj86.com/coolaj86/greenlock-express.js/src/commit/bd05ba77b685ce7fa97e7d8171897a9914e6a85a/README.md
//visit: https://medium.com/@bohou/secure-your-nodejs-server-with-letsencrypt-for-free-f8925742faa9


const server = http.createServer(appModule.init());

eventEmitter=appModule.eventEmitter

//socket server
let io_server = socket.init(server,appModule)

//socket-client for daynver module to update server urls  automatically
let io_client = socket_client.mSocket.init(appModule);


server.listen(PORT,HOST,null,()=>{
  console.log(`Server Environment Mode:`, process.env?.NODE_ENV);
  console.log(`Server running on:`, process.env.DEFAULT_MAIL_SERVER_URL);
  console.log(`------------Socket Api url servers---------------`);
});

/*const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});*/

export default server
