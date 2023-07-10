import  fs from "fs";
import path from "path";
import glob from 'glob-all'
import {Base} from "../../../config";
import TemplateController from "./controllers";
import TemplateModel from "./models";
import TemplateRouteExpress from "./routes/express";
import TemplateService from "./services";
import TemplateValidator from "./validations";
import TemplateValidatorPartIndex from "./validations/parts";
import TemplateValidatorSendOne from "./validations/parts/send-one";
import TemplateSchemaSendOne from "./docs/swagger/parts/send-one";
import TemplateSchemaPartIndex from "./docs/swagger/parts";
import TemplateSchema from "./docs/swagger";

let base = Base

let getFiles=(
    data=[
        base+'/app/api_builder/**/*.builder.json',
        base+'/app/api_builder/**/*.builder.json',
    ]
)=> {
    return glob.sync(
        data,
        {dot: true}
    )
}

let BuildData=(name,columns,path)=>{
    return {
        controllers: {
            index:TemplateController(name)
        },
        models: {
            index:TemplateModel(name,columns,path)
        },
        routes: {
            index:TemplateRouteExpress(name,path),
        },
        services: {
            index:TemplateService(name)
        },
        validations: {
            index:TemplateValidator(name),
            part:{
                index:TemplateValidatorPartIndex(name),
                sendOne: TemplateValidatorSendOne(name)
            }
        },
        docs:{
            index:TemplateSchema(name),
            part:{
                index:TemplateSchemaPartIndex(name),
                sendOne: TemplateSchemaSendOne(name)
            }
        }
    }
}

const BuildApi=()=>{
    const files=getFiles()
    if(files.length>0) {

        files.map(async (file )=>{
            let schema
            try {
                schema=fs.readFileSync(file,{encoding:'utf8', flag:'r'})
            }catch (e) {

            }
            if(schema){
                schema=JSON.parse(schema)

                if(schema.generate_api){

                    if(schema?.parent_path!=='api' || schema?.parent_path!=='core'){
                        schema.path='api'+schema?.child_path
                    }else {
                        schema.path=schema?.parent_path+schema?.child_path
                    }
                    if(schema.old_name){
                        fs.rmdir(
                            path.join(__dirname,'../../../',schema.path,schema.old_name),
                            { recursive: true },
                            function (err,file) {
                                if(err){
                                    return err
                                }
                            }
                        )
                    }
                    const BuildFiles={
                        controllers:{
                            path:path.join(__dirname,'../../../',schema.path,schema.name,'controllers')
                        },
                        models:{
                            path:path.join(__dirname,'../../../',schema.path,schema.name,'models'),
                        },
                        routes:{
                            path:path.join(__dirname,'../../../',schema.path,schema.name,'routes'),
                            pathExpress:path.join(__dirname,'../../../',schema.path,schema.name,'routes/express'),
                        },
                        services:{
                            path:path.join(__dirname,'../../../',schema.path,schema.name,'services')
                        },
                        validations:{
                            path:path.join(__dirname,'../../../',schema.path,schema.name,'validations'),
                            part:{
                                index:path.join(__dirname,'../../../',schema.path,schema.name,'validations/parts'),
                                sendOne:path.join(__dirname,'../../../',schema.path,schema.name,'validations/parts'),
                            }
                        },
                        docs:{
                            path:path.join(__dirname,'../../../',schema.path,schema.name,'docs/swagger'),
                            part:{
                                index:path.join(__dirname,'../../../',schema.path,schema.name,'docs/swagger/parts'),
                                sendOne:path.join(__dirname,'../../../',schema.path,schema.name,'docs/swagger/parts'),
                            }
                        },
                    }

                    try {
                        let data=BuildData(schema.name,schema?.model.columns,schema.path)
                        fs.mkdirSync(BuildFiles.models.path,{recursive:true})
                        fs.writeFileSync(path.join(BuildFiles.models.path,schema.name+'.model.js'),data.models.index.model)
                        fs.writeFileSync(path.join(BuildFiles.models.path,schema.name+'.schema.json'),data.models.index.schema)

                        fs.mkdirSync(BuildFiles.services.path,{recursive:true})
                        fs.writeFileSync(path.join(BuildFiles.services.path,schema.name+'.service.js'),data.services.index)

                        fs.mkdirSync(BuildFiles.controllers.path,{recursive:true})
                        fs.writeFileSync(path.join(BuildFiles.controllers.path,schema.name+'.controller.js'),data.controllers.index)

                        fs.mkdirSync(BuildFiles.validations.path,{recursive:true})
                        fs.mkdirSync(BuildFiles.validations.part.sendOne,{recursive:true})
                        fs.mkdirSync(BuildFiles.validations.part.index,{recursive:true})
                        fs.writeFileSync(path.join(BuildFiles.validations.part.sendOne,'send-one.js'),data.validations.part.sendOne)
                        fs.writeFileSync(path.join(BuildFiles.validations.part.index,'index.js'),data.validations.part.index)
                        fs.writeFileSync(path.join(BuildFiles.validations.path,schema.name+'.validation.js'),data.validations.index)

                        fs.mkdirSync(BuildFiles.docs.path,{recursive:true})
                        fs.mkdirSync(BuildFiles.docs.part.sendOne,{recursive:true})
                        fs.mkdirSync(BuildFiles.docs.part.index,{recursive:true})
                        fs.writeFileSync(path.join(BuildFiles.docs.part.sendOne,'send-one.js'),data.docs.part.sendOne)
                        fs.writeFileSync(path.join(BuildFiles.docs.part.index,'index.js'),data.docs.part.index)
                        fs.writeFileSync(path.join(BuildFiles.docs.path,schema.name+'.doc.js'),data.docs.index)

                        fs.mkdirSync(BuildFiles.routes.path,{recursive:true})
                        fs.mkdirSync(BuildFiles.routes.pathExpress,{recursive:true})
                        fs.writeFileSync(path.join(BuildFiles.routes.pathExpress,'index.js'),data.routes.index.express)
                        fs.writeFileSync(path.join(BuildFiles.routes.path,schema.name+'.route.json'),data.routes.index.route)
                    }catch (e) {
                        console.log('error building api : ',e)
                    }

                }


            }


        })
    }
}


export default BuildApi