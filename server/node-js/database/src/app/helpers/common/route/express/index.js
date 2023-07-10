import express from 'express';
import ioRouter from '../../../../../modules/node-socket.io-router/lib'

import AuthMiddleware from '../../../../middlewares/auth';
import AccessMiddleware from '../../../../middlewares/access';
//let router = express.Router();
const authMiddleware=new AuthMiddleware()
const accessMiddleware=new AccessMiddleware()
export default class ModelRoute{
    parentPath
    constructor(parentPath,controller) {
        this.parentPath=parentPath
        this.modelController=controller
    }
    router = express.Router()
    socketRouter=ioRouter()
    
    routes =[]
    requireAuth=[accessMiddleware.required,authMiddleware.required]

    setHandler={
        create:{
            many:{

                defaultAuth:true,
                isActive:true,
                handlers:[],

            },
            one:{

                defaultAuth:true,
                isActive:true,
                handlers:[],

            }
        },
        find:{
            many:{

                defaultAuth:true,
                isActive:true,
                handlers:[],

            },
            one:{

                defaultAuth:true,
                isActive:true,
                handlers:[],

            }

        },
        get:{
            many:{

                defaultAuth:true,
                isActive:true,
                handlers:[],

            },
            one:{

                defaultAuth:true,
                isActive:true,
                handlers:[],

            }

        },
        update:{
            many:{
                defaultAuth:true,
                isActive:true,
                handlers:[],
            },
            one:{
                defaultAuth:true,
                isActive:true,
                handlers:[],
            }
        },
        delete:{
            many:{
                defaultAuth:true,
                isActive:true,
                handlers:[],
            },
            one:{
                defaultAuth:true,
                isActive:true,
                handlers:[],
            }
        },
        custom:[]
    }

    modelController
    setCreateMany(data=this.setHandler.create.many){

        let defaultValue={
            method:'post',
            path:this.parentPath+'/create-many',
            defaultAuth:true,
            isActive:true,
            handlers:[],
            controller:this.modelController.createMany
        }
        if(data.defaultAuth){
            data.handlers=[...this.requireAuth,...data.handlers]
        }
        defaultValue= Object.assign(
            defaultValue,
            data
        )
        this.routes.push(defaultValue); 

    }
    setCreateOne(data=this.setHandler.create.one){
        let defaultValue={
            method:'post',
            path:this.parentPath+'/create-one',
            defaultAuth:true,
            isActive:true,
            handlers:[],
            controller:this.modelController.createOne
        }
        if(data.defaultAuth){
            data.handlers=[...this.requireAuth,...data.handlers]
        }
        defaultValue= Object.assign(
            defaultValue,
            data
        )
        this.routes.push(defaultValue); 
    }
    setFindMany(data=this.setHandler.find.many){
        let defaultValue={
            method:'post',
            path:this.parentPath+'/find-many',
            defaultAuth:true,
            isActive:true,
            handlers:[],
            controller:this.modelController.findMany
        }
        if(data.defaultAuth){
            data.handlers=[...this.requireAuth,...data.handlers]
        }
        defaultValue= Object.assign(
            defaultValue,
            data
        )
        this.routes.push(defaultValue); 

    }
    setFindOne(data=this.setHandler.find.one){
        let defaultValue={
            method:'post',
            path:this.parentPath+'/find-one',
            defaultAuth:true,
            isActive:true,
            handlers:[],
            controller:this.modelController.findOne
        }
        if(data.defaultAuth){
            data.handlers=[...this.requireAuth,...data.handlers]
        }
        defaultValue= Object.assign(
            defaultValue,
            data
        )
        this.routes.push(defaultValue); 
    }

    setGetMany(data=this.setHandler.find.many){
        let defaultValue={
            method:'get',
            path:this.parentPath+'/get-many',
            defaultAuth:true,
            isActive:true,
            handlers:[],
            controller:this.modelController.getMany
        }
        if(data.defaultAuth){
            data.handlers=[...this.requireAuth,...data.handlers]
        }
        defaultValue= Object.assign(
            defaultValue,
            data
        )
        this.routes.push(defaultValue);

    }
    setGetOne(data=this.setHandler.find.one){
        let defaultValue={
            method:'get',
            path:this.parentPath+'/get-one',
            defaultAuth:true,
            isActive:true,
            handlers:[],
            controller:this.modelController.getOne
        }
        if(data.defaultAuth){
            data.handlers=[...this.requireAuth,...data.handlers]
        }
        defaultValue= Object.assign(
            defaultValue,
            data
        )
        this.routes.push(defaultValue);
    }

    setUpdateMany(data=this.setHandler.update.many){
        let defaultValue={
            method:'put',
            path:this.parentPath+'/update-many',
            defaultAuth:true,
            isActive:true,
            handlers:[],
            controller:this.modelController.updateMany
        }
        if(data.defaultAuth){
            data.handlers=[...this.requireAuth,...data.handlers]
        }
        defaultValue= Object.assign(
            defaultValue,
            data
        )
        this.routes.push(defaultValue); 
    }
    setUpdateOne(data=this.setHandler.update.one){
        let defaultValue={
            method:'put',
            path:this.parentPath+'/update-one',
            defaultAuth:true,
            isActive:true,
            handlers:[],
            controller:this.modelController.updateOne
        }
        if(data.defaultAuth){
            data.handlers=[...this.requireAuth,...data.handlers]
        }
        defaultValue= Object.assign(
            defaultValue,
            data
        )
        this.routes.push(defaultValue); 
    }
    setDeleteMany(data=this.setHandler.delete.many){
        let defaultValue={
            method:'delete',
            path:this.parentPath+'/delete-many',
            defaultAuth:true,
            isActive:true,
            handlers:[],
            controller:this.modelController.deleteMany
        }
        if(data.defaultAuth){
            data.handlers=[...this.requireAuth,...data.handlers]
        }
        defaultValue= Object.assign(
            defaultValue,
            data
        )
        this.routes.push(defaultValue); 
    }
    setDeleteOne(data=this.setHandler.delete.one){
        let defaultValue={
            method:'delete',
            path:this.parentPath+'/delete-one',
            defaultAuth:true,
            isActive:true,
            handlers:[],
            controller:this.modelController.deleteOne
        }
        if(data.defaultAuth){
            data.handlers=[...this.requireAuth,...data.handlers]
        }
        defaultValue= Object.assign(
            defaultValue,
            data
        )
        this.routes.push(defaultValue); 
    }


    setCustomRoutes(routes=this.routes){
        if(routes)
            routes.forEach((route)=>{
                this.socketRouter.stack.push({
                    path:route.path,
                    handlers:[...route.handlers,route.controller]
                })
                switch (route.method){
                    case 'post':
                        if(route.handlers){
                            this.router.post(
                                route.path,
                                [...route.handlers,route.controller]

                            );
                        } else  {
                            this.router.post(
                                route.path,
                                route.controller
                            );
                        }
                        break;
                    case 'get':
                        if(route.handlers){
                            this.router.get(
                                route.path,
                                [...route.handlers,route.controller]

                            );
                        } else  {
                            this.router.get(
                                route.path,
                                route.controller
                            );
                        }
                        break;
                    case 'put':
                        if(route.handlers){
                            this.router.put(
                                route.path,
                                [...route.handlers,route.controller]
                            );
                        } else  {
                            this.router.put(
                                route.path,
                                route.controller
                            );
                        }
                        break;
                    case 'patch':
                        if(route.handlers){
                            this.router.patch(
                                route.path,
                                [...route.handlers,route.controller]
                            );
                        } else  {
                            this.router.patch(
                                route.path,
                                route.controller
                            );
                        }
                        break;
                    case 'delete':
                        if(route.handlers){
                            this.router.delete(
                                route.path,
                                [...route.handlers,route.controller]
                            );
                        } else  {
                            this.router.delete(
                                route.path,
                                route.controller
                            );
                        }
                        break;
                }
            })
    }

    init=1
    setCustomDefaultRoutes(datas=this.setHandler.custom){
        datas.forEach(data=>{
            let path
            if(this.parentPath && !data.childPath){
                path=this.parentPath+'/item-'+this.init
                this.init++
            } else{
                path=(data.path)?data.path:this.parentPath+data.childPath
            }
            let defaultValue={
                method:'post',
                path:path,
                defaultAuth:true,
                isActive:true,
                handlers:[],
                controller:this.modelController.createMany
            }
            if(data.defaultAuth){
                data.handlers=[...this.requireAuth,...data.handlers]
            }
            defaultValue= Object.assign(
                defaultValue,
                data
            )
            this.routes.push(defaultValue); 
        })
    }
    getDefaultCRUD(){
        if(this.setHandler.create.many.isActive){
            this.setCreateMany()
        }

        if(this.setHandler.create.one.isActive){

            this.setCreateOne()
        }

        if(this.setHandler.find.many.isActive){
            this.setFindMany()
        }

        if(this.setHandler.find.one.isActive){
            this.setFindOne()
        }

        if(this.setHandler.get.many.isActive){
            this.setGetMany()
        }

        if(this.setHandler.get.one.isActive){
            this.setGetOne()
        }

        if(this.setHandler.update.many.isActive){
            this.setUpdateMany()
        }

        if(this.setHandler.update.one.isActive){
            this.setUpdateOne()
        }

        if(this.setHandler.delete.many.isActive){
            this.setDeleteMany()
        }

        if(this.setHandler.delete.one.isActive){
            this.setDeleteOne()
        }

        this.setCustomRoutes()

        return {
            router:this.router,
            socketRouter:this.socketRouter
        }
    }
    getAllRoutes(){
        this.getDefaultCRUD()
        this.setCustomDefaultRoutes()
        this.setCustomRoutes()
        return {
            router:this.router,
            socketRouter:this.socketRouter
        }
    }
    getCustomRoutes(){
        this.setCustomRoutes()
        return {
            router:this.router,
            socketRouter:this.socketRouter
        }
    }
    getCustomDefaultRoute(){
        this.setCustomDefaultRoutes()
        this.setCustomRoutes()
        return {
            router:this.router,
            socketRouter:this.socketRouter
        }
    }


}