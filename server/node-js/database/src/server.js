import 'module-alias/register';
import './module-alias'
import 'reflect-metadata';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand'
import http from 'http';
import App from '@config/server/express';// the actual Express app
import {typeDatabase,typeValidation} from "./app/services/database/typeorm";
import acebaseClient from "./app/config/database/acebase/acebase-client";


import * as socket from './app/services/notification/socket-io/socket.service'
import * as socket_client from './app/services/notification/socket-io/socket-client.service'

dotenvExpand.expand(dotenv.config())


global.eventEmitter=''


//database typeorm ||
typeDatabase.connect(typeValidation);

const PORT = process.env.PORT || 4400;
const HOST = process.env.HOST || '0.0.0.0';

let appModule = new App()
const server = http.createServer(appModule.init());

eventEmitter=appModule.eventEmitter

//database acabase ||
appModule.acebaseClient=acebaseClient.init()


//socket
let io = socket.init(server,appModule)

//socket-client for auth
let io_client = socket_client.mSocket.init(appModule);


server.listen(PORT,HOST,null, () => {
  console.log(`Server Environment Mode:`, process.env?.NODE_ENV);
  console.log(`Server running on:`, process.env.DEFAULT_DATABASE_SERVER_URL);
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
