import  fs from "fs";
import path from "path";
import glob from 'glob-all'
import {Base} from "../../../../config";
import TemplateController from "./controllers";
import TemplateModel from "./models/typeorm";
import TemplateRouteExpress from "./routes/express";
import TemplateService from "./services/typeorm";
import TemplateValidator from "./validations/typeorm";
import TemplateValidatorPartIndex from "./validations/typeorm/parts";
import TemplateValidatorCreateOne from "./validations/typeorm/parts/create-one";
import TemplateSchemaCreateOne from "./docs/swagger/parts/create-one";
import TemplateSchemaPartIndex from "./docs/swagger/parts";
import TemplateSchema from "./docs/swagger";

let base = Base

let getFiles=(
    data=[
        base+'/app/api_builder/typeorm/**/*.builder.json',
        base+'/app/api_builder/typeorm/**/*.builder.json',
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
                createOne: TemplateValidatorCreateOne(name)
            }
        },
        docs:{
            index:TemplateSchema(name),
            part:{
                index:TemplateSchemaPartIndex(name),
                createOne: TemplateSchemaCreateOne(name)
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

                    if(!schema?.parent_path){
                        schema.path='rest/api/'+schema?.child_path
                    }else {
                        schema.path='rest/'+schema?.parent_path+schema?.child_path
                    }
                    if(schema.old_name){
                        fs.rmdir(
                            path.join(__dirname,'../../../../',schema.path,schema.old_name),
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
                            path:path.join(__dirname,'../../../../',schema.path,schema.name,'controllers')
                        },
                        models:{
                            path:path.join(__dirname,'../../../../',schema.path,schema.name,'models/typeorm'),
                        },
                        routes:{
                            path:path.join(__dirname,'../../../../',schema.path,schema.name,'routes'),
                            pathExpress:path.join(__dirname,'../../../../',schema.path,schema.name,'routes/express'),
                        },
                        services:{
                            path:path.join(__dirname,'../../../../',schema.path,schema.name,'services/typeorm')
                        },
                        validations:{
                            path:path.join(__dirname,'../../../../',schema.path,schema.name,'validations/typeorm'),
                            part:{
                                index:path.join(__dirname,'../../../../',schema.path,schema.name,'validations/typeorm/parts'),
                                createOne:path.join(__dirname,'../../../../',schema.path,schema.name,'validations/typeorm/parts'),
                            }
                        },
                        docs:{
                            path:path.join(__dirname,'../../../../',schema.path,schema.name,'docs/swagger'),
                            part:{
                                index:path.join(__dirname,'../../../../',schema.path,schema.name,'docs/swagger/parts'),
                                createOne:path.join(__dirname,'../../../../',schema.path,schema.name,'docs/swagger/parts'),
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
                        fs.mkdirSync(BuildFiles.validations.part.createOne,{recursive:true})
                        fs.mkdirSync(BuildFiles.validations.part.index,{recursive:true})
                        fs.writeFileSync(path.join(BuildFiles.validations.part.createOne,'create-one.js'),data.validations.part.createOne)
                        fs.writeFileSync(path.join(BuildFiles.validations.part.index,'index.js'),data.validations.part.index)
                        fs.writeFileSync(path.join(BuildFiles.validations.path,schema.name+'.validation.js'),data.validations.index)

                        fs.mkdirSync(BuildFiles.docs.path,{recursive:true})
                        fs.mkdirSync(BuildFiles.docs.part.createOne,{recursive:true})
                        fs.mkdirSync(BuildFiles.docs.part.index,{recursive:true})
                        fs.writeFileSync(path.join(BuildFiles.docs.part.createOne,'create-one.js'),data.docs.part.createOne)
                        fs.writeFileSync(path.join(BuildFiles.docs.part.index,'index.js'),data.docs.part.index)
                        fs.writeFileSync(path.join(BuildFiles.docs.path,schema.name+'.doc.js'),data.docs.index)

                        fs.mkdirSync(BuildFiles.routes.path,{recursive:true})
                        fs.mkdirSync(BuildFiles.routes.pathExpress,{recursive:true})
                        fs.writeFileSync(path.join(BuildFiles.routes.pathExpress,'index.js'),data.routes.index.express)
                        fs.writeFileSync(path.join(BuildFiles.routes.path,schema.name+'.route.json'),data.routes.index.route)
                    }catch (e) {

                    }

                }


            }


        })
    }
}


export default BuildApi