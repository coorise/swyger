import ValidationModel from "../../enjoi";
import Joi from "joi";
import HTTP_RESPONSE_CODE from "../../../../all-http-response-code";

const requireUID={
    "uid":{
        "type":"string",
        "require":true
    }
}

export default class ValidationService{
    schema
    constructor(schema) {
        this.schema=schema
    }
    createOne=async (data)=>{
        //console.log('properties ',this.schema?.create.one)
        const properties ={
            properties:this.schema?.create.one
        }
        const schema= ValidationModel(properties)
        try {
            await Joi.attempt(data,schema,{
                allowUnknown: true
            })
        }catch (e) {
            return {
                error:{
                    code:HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
                    message:e.toString()
                }
            }
        }
    }
    createMany=async (data)=>{
        const properties ={
            items:true,
            properties:this.schema?.create.many
        }
        const schema= ValidationModel(properties)
        try {
            await Joi.attempt(data,schema,{
                allowUnknown: true
            })
        }catch (e) {
            return {
                error:{
                    code:HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
                    message:e.toString()
                }
            }
        }
    }
    updateOne=async (data)=>{
        const properties ={
            properties:Object.assign(
                {},
                this.schema?.update.one,
                requireUID
            )
        }
        const schema= ValidationModel(properties)
        try {
            await Joi.attempt(data,schema,{
                allowUnknown: true
            })
        }catch (e) {
            return {
                error:{
                    code:HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
                    message:e.toString()
                }
            }
        }
    }
    updateMany=async (data)=>{
        const properties ={
            items:true,
            properties:Object.assign(
                {},
                this.schema?.update.one,
                requireUID
            )
        }
        const schema= ValidationModel(properties)
        try {
            await Joi.attempt(data,schema,{
                allowUnknown: true
            })
        }catch (e) {
            return {
                error:{
                    code:HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
                    message:e.toString()
                }
            }
        }
    }
    findOne=async (data)=>{
        const properties ={
            properties:this.schema?.find.one
        }
        const schema= ValidationModel(properties)
        try {
            await Joi.attempt(data,schema,{
                allowUnknown: true
            })
        }catch (e) {
            return {
                error:{
                    code:HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
                    message:e.toString()
                }
            }
        }
    }
    findMany=async (data)=>{
        const properties ={
            properties:this.schema?.find.many
        }
        const schema= ValidationModel(properties)
        try {
            await Joi.attempt(data,schema,{
                allowUnknown: true
            })
        }catch (e) {
            return {
                error:{
                    code:HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
                    message:e.toString()
                }
            }
        }
    }
    deleteOne=async (data)=>{
        const properties ={
            properties:Object.assign(
                {},
                this.schema?.delete.one,
                requireUID
            )
        }
        const schema= ValidationModel(properties)
        try {
            await Joi.attempt(data,schema,{
                allowUnknown: true
            })
        }catch (e) {
            return {
                error:{
                    code:HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
                    message:e.toString()
                }
            }
        }
    }
    deleteMany=async (data)=>{
        const properties ={
            items:true,
            properties:Object.assign(
                {},
                this.schema?.delete.one,
                requireUID
            )
        }
        const schema= ValidationModel(properties)
        try {
            await Joi.attempt(data,schema,{
                allowUnknown: true
            })
        }catch (e) {
            return {
                error:{
                    code:HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
                    message:e.toString()
                }
            }
        }
    }
}