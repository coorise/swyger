import fs from "fs";
import path from "path";
import TemplateBuilder from "./api_builder";
import {JsonDB} from "node-json-db";
import {Config} from "node-json-db/dist/lib/JsonDBConfig";
import {Base} from "../../../config";
import glob from "glob-all";
import AsyncUtil from "async-utility";

let data={
    path:{}
}
let base = Base
let response={}
let error= {
    message: 'Something went wrong with json schema builder',
    code: 400,
    errors: []
}
let model

const createOne =(entities={},create)=>{
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    //console.log('send one ', create)
    if(create?.name){
        if(!specialChars.test(create.name)){
            let name=create.name
            const checkCapital=name.match(/[A-Z]/g)
            if(checkCapital?.length>0){
                let array=checkCapital.map(async (capital)=>{
                    return new Promise(resolve=>{
                        name=name.replace(capital,'_'+capital)
                        resolve()
                    })
                })
                const makeAsync=AsyncUtil.toSync(async ()=>{
                    await Promise.all(array)
                })
                makeAsync()
            }
            if(name.charAt(0)==='_'){
                name=name.replace(name.charAt(0),'')
            }

            name=name.toLowerCase()
            const PluralName=(name.match(/s$/))?name:name+'s'
            data.name=name
            if(create?.generated_api){
                data.generated_api=create.generated_api
            }else {
                data.generated_api=true
            }
            if(create?.parent_path!=='api' || create?.parent_path!=='core'){
                data.path.parent=create.parent_path
            }else {
                data.path.parent='api'
            }
            if(create?.child_path){
                data.path.child=create.child_path
            }else{
                data.path.child=""
            }
            if(create?.model.columns){
                data.columns=create.model.columns
            }
            /*try {
                fs.writeFileSync(path.join(__dirname,'../../../','api_builder',PluralName+'.builder.json'),TemplateBuilder(data))
            }catch (e) {
                //error.errors.push('File writing error: '+e.toString())

            }*/
            try {
                //Please be aware with node-json-db, cuz starting to 2.0
                //there is some break change : asynchronous
                //we tested 2.0, but we got some bugs, hope they will fix it
                let db = new JsonDB(new Config(base+'/app/api_builder/'+PluralName+'.builder.json', true, true, '/'));
                //console.log('get data ',data)
                db.push('/',JSON.parse(TemplateBuilder(data)))
                model=db.getData('/')
            }catch (e) {
                error.errors.push('Error with writing: '+error.toString())
            }
        }
        else {
            error.errors.push('Please remove special chars in: '+create.name)
        }


    }
    else {
        error.errors.push('Please give us the name of your entity')
    }
    response.data=model
    if(error.errors.length>0){
        response.error=error
    }
    return response

}
const createMany=(entities={},files)=>{
    if(files.length>0) {
        model=[]
        files.map(async (file )=>{
            const result =createOne(entities,file)
            if(result?.error){
                error.errors.push(result.error)
            }
            if(result?.data){
                model.push(result.data)
            }
        })
    }
    response.data=model
    if(error.errors.length>0){
        response.error=error
    }
    return response
}
const findOne=(entities={},data)=>{
    let filename=data?.filename
    if(fs.existsSync(path.join(__dirname,'../../../','api_builder',filename))){
        try {
            let db = new JsonDB(new Config(base+'/app/api_builder'+filename, true, true, '/'));
            //console.log('get data ',data)
            model=db.getData('/')
        }catch (e) {
            error.errors.push('Error with reading: '+error.toString())
        }
    }else {
        error.errors.push('File does\'nt exist: '+filename)
    }
    response.data=model
    if(error.errors.length>0){
        response.error=error
    }
    return response

}
const findMany=(entities={},option={})=>{
    if(option?.name){
        option.name='*'+option.name+'*'
    }else {
        option.name='*'
    }
    let getFiles=(
        data=[
            base+'/app/api_builder/**/'+option.name+'.builder.json',
            base+'/app/api_builder/**/'+option.name+'.builder.json',
        ]
    )=> {
        return glob.sync(
            data,
            {dot: true}
        )
    }
    let files=getFiles()
    if(files.length>0) {
        model=[]
        if(option?.start && option?.end){
            files=files.slice(option.start,option.end)
        }
        files.map(async (file )=>{
            const result =findOne(entities,file)
            if(result?.error){
                error.errors.push(result.error)
            }
            if(result?.data){
                model.push(result.data)
            }
        })
    }
    response.data=model
    if(error.errors.length>0){
        response.error=error
    }
    return response
}
const updateOne=(entities={},create)=>{
    if(!fs.existsSync(path.join(__dirname,'../../../','api_builder',create?.filename))){
        error.errors.push('Error with writing: '+error.toString())
        if(error.errors.length>0){
            response.error=error
        }
        return response
    }
    delete create.filename
    return createOne(create)
}
const updateMany=(entities={},creates)=>{
    if(creates.length>0) {
        model=[]
        creates.map(async (create )=>{
            const result =updateOne(entities,create)
            if(result?.error){
                error.errors.push(result.error)
            }
            if(result?.data){
                model.push(result.data)
            }
        })
    }
    response.data=model
    if(error.errors.length>0){
        response.error=error
    }
    return response
}
const deleteOne=(entities={},data)=>{
    let filename=data?.filename
    if(fs.existsSync(path.join(__dirname,'../../../','api_builder',filename))){
        try {
            fs.unlinkSync(path.join(__dirname,'../../../','api_builder',filename))
        }catch (e) {
            error.errors.push('Error with deleting: '+error.toString())
        }
    }else {
        error.errors.push('File does\'nt exist: '+filename)
    }
    response.data='ok'
    if(error.errors.length>0){
        response.error=error
    }
    return response
}
const deleteMany=(entities={},files)=>{
    if(files.length>0) {
        model=[]
        files.map(async (file )=>{
            const result =deleteOne(entities,file)
            if(result?.error){
                error.errors.push(result.error)
            }
            if(result?.data){
                model.push(result.data)
            }
        })
    }
    response.data=model
    if(error.errors.length>0){
        response.error=error
    }
    return response
}
export default {
    createOne,
    createMany,
    findOne,
    findMany,
    updateOne,
    updateMany,
    deleteOne,
    deleteMany,
}
