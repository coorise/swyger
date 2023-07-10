import {Router} from 'express';
import ioRouter from '../../../modules/node-socket.io-router/lib'
import glob from "glob-all";
import fs from "fs";
import AsyncUtil from "async-utility";
//import syncImport from "sync-import/src/syncImport";

import {Base} from '../../config';

const router = new Router();
const socketRouter= ioRouter()
let base = Base

let getFiles=(data=[
    base+'/app/rest/core/**/routes/*.route.json',
    base+'/app/rest/api/**/routes/*.route.json',
])=> {
    return glob.sync(
        data,
        {dot: true}
    )
}


//console.log('/src/app/core$ index.js line 21 router.use()')
const files=getFiles()
let makeSync
try {
    if(files.length>0)
    {
        //console.log('files ',files)
        const array=files.map(async (file )=>{
            return await new Promise(async resolve=>{
                let schema
                try {
                    schema=fs.readFileSync(file,{encoding:'utf8', flag:'r'})

                }catch (e) {
                    console.log('error route schema ', e)
                }

                if(schema){
                    schema=JSON.parse(schema)
                    //console.log('route ',schema?.route)
                    let route =await import(`${schema?.route.toString()}`)

                    if(route){
                        route=route.default

                        if(route?.router){
                            router.use(...route.router);
                        }

                        if(route?.socketRouter){
                            socketRouter.stack.push(Object.assign({},route.socketRouter))
                        }
                    }



                }

                resolve()
            })

        })
        makeSync=AsyncUtil.toSync(async ()=>{
            return await Promise.all(array)
        })
        makeSync()
    }
}catch (e) {
    console.log(e)
}


//console.log('get route ',socketRouter.stack)


export default {
    router,
    socketRouter
};
