import glob from "glob-all";
import {Base} from "../../../config";
import AsyncUtil from "async-utility";
let base = Base
let getFiles=(data=[
    base+'/app/rest/core/**/docs/swagger/*.doc.js',
    base+'/app/rest/api/**/docs/swagger/*.doc.js',
])=> {
    return glob.sync(
        data,
        {dot: true}
    )
}
let swaggerSchema={}
const files=getFiles()
try {
    if(files.length>0)
    {
        const array=files.map(async (file )=>{
            return new Promise(async resolve => {
                let schema= await import('../../../../../'+file)
                swaggerSchema=Object.assign(swaggerSchema,schema?.default)
                resolve()
            })
        })
        const makeSync=AsyncUtil.toSync(async ()=>{
            return await Promise.all(array)
        })
        makeSync()
    }
}catch (e) {
    console.log(e)
}
//console.log('file ',swaggerSchema)
export default {
    "paths":{
        ...swaggerSchema,

    }
}

