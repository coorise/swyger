import sendOne from "./parts/send-one";
import sendMany from "./parts/send-many";
import AsyncUtil from "async-utility";
import fs from "fs";
// @ts-ignore
import {Base} from "@config";

class TypeService {
    constructor() {

    }

    sendOne=async (request:any)=> await sendOne(request)
    sendMany=async (request:any)=> await sendMany(request)


}

export {
    sendOne,
    sendMany,
    TypeService

}
