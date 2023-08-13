import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import xss from 'xss-clean';
import EventEmitter from 'events';
import ioRouter from '../../../../modules/node-socket.io-router/lib'
import fileUpload from 'express-fileupload'
import {
    errorHandle,
    notFoundHandle,
    logErrors
} from '../../../helpers/handle-errors';
import {
    logger,
    swagger,
    mailComposer
} from '../../../services';

import core from '../../../rest/core';

import {NodeMailerClient} from "../../../services/mailer/client";
import ExpressHandler from "./express-handler";
import SocketHandler from "./socket-handler";


const rootApi = process.env.API_PATH ||'/api/v1';
const rootDocApi = process.env.SWAGGER_URL ||'/api-docs';




class ModuleApp {
    authAdminToken=process.env.AUTH_ADMIN_TOKEN;
    daynverServerUrl = process.env.DEFAULT_DAYNVER_SERVER_URL
    authServerUrl = process.env.DEFAULT_AUTH_SERVER_URL;
    databaseServerUrl = process.env.DEFAULT_DATABASE_SERVER_URL;
    mailServerUrl = process.env.DEFAULT_MAIL_SERVER_URL;
    phoneServerUrl = process.env.DEFAULT_PHONE_SERVER_URL;
    storageServerUrl = process.env.DEFAULT_STORAGE_SERVER_URL;
    cronServerUrl = process.env.DEFAULT_CRON_SERVER_URL;


    netSocket

    io
    privateSocket
    publicSocket
    socketRouter= ioRouter()

    verify
    user
    eventEmitter = new EventEmitter();
    entitySchema
    mailComposer=mailComposer

    sendMail=async (data,config)=>{
        //Don't forget to add MX, SPF and DKIM record from your domain name
        //If you don't know
        //visit: https://documentation.mailjet.com/hc/en-us/articles/360043050113-How-to-setup-DomainKeys-DKIM-and-SPF-in-my-DNS-records-

        return await NodeMailerClient.send(
            data,
            Object.assign(
                {
                    port:process.env.MAIL_HOST,
                    host:process.env.MAIL_HOST,
                    secure:true,
                    auth:{
                        user:process.env.MAIL_SENDER,
                        pass:process.env.MAIL_PASS
                    },
                    tls : { rejectUnauthorized: false }
                },
                config
            )
        )
    }
    constructor() {}
    init() {
        const app = express();

        //app.set('trust proxy', 1); // trust first proxy
        app.set('trust proxy', true);

        // Security
        app.use(helmet());
        /*app.use(function(req, res, next) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

          // Add this
          if (req.method === 'OPTIONS') {

            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, OPTIONS');
            res.header('Access-Control-Max-Age', 120);
            return res.status(200).json({});
          }

          next();

        });*/
        app.use(cors({
            origin:'*'
        }));




        // compression
        app.use(compression());

        app.use(cookieParser());
        // logs http request
        app.use(morgan(process.env.LOG_FORMAT || 'dev', {
            stream: logger.stream
        }));

        // parse requests of content-type - application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({
            extended: true
        }));

        // sanitize request data
        app.use(xss());

        // parse json request body
        app.use(express.json());
        // parse requests of content-type - application/json
        app.use(bodyParser.json());

        //parse requests of content-type - multipart/form-data
        app.use(fileUpload())

        //express handler to save data in (req.)
        ExpressHandler(app,this)

        //app.use('/static', express.static(path.join(ROOT_FOLDER, 'storage')));

        if(process.env?.NODE_ENV==='development') app.use(rootDocApi, swagger());

        app.use(rootApi, core.router);

        app.use(notFoundHandle);
        app.use(logErrors);
        app.use(errorHandle);

        ////////////////////SOCKET///////////////////////////

        //parse requests of content-type - multipart/form-data
        this.socketRouter.use(fileUpload())
        //socket handler to save data in (req.)
        SocketHandler(this)

        this.socketRouter.use(rootApi, core.socketRouter);

        /*this.socketRouter.use(notFoundHandle);
        this.socketRouter.use(logErrors);
        this.socketRouter.use(errorHandle);*/

        return app

    }

}


export default ModuleApp;
