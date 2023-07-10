import  fs from "fs";
import path from "path";
import TemplateBuilder from "./api_builder";
import BuildApi from "./index";
import AsyncUtil from "async-utility";


let name
let columns

let data={
    path:{}
}
const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

//console.log('builder name ',process.argv)
//script: npm run swyger -- --create api --name likes
if ( ( process.argv && process.argv.indexOf('--create') ) ) {
    if(process.argv[process.argv.indexOf('--create') + 1]==='api'){
        if ( (process.argv.indexOf('--name') !== -1 ) ) {
            name=process.argv[process.argv.indexOf('--name') + 1]
            if(!specialChars.test(name)){
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
                data.name=name

                const PluralName=(name.match(/s$/))?name:name+'s'

                if ( (process.argv.indexOf('--columns') !== -1 ) ) {

                    try {
                        columns=JSON.stringify(process.argv[process.argv.indexOf('--name') + 1],null,2)
                        data.columns=columns
                    }catch (e) {

                    }

                }
                if ( (process.argv.indexOf('--parent') !== -1 ) ) {
                    let parent=process.argv[process.argv.indexOf('--parent') + 1]
                    if(parent!=='api' || parent!=='core'){
                        data.path.parent=parent
                    }else {
                        data.path.parent='api'
                    }

                }
                if ( (process.argv.indexOf('--child') !== -1 ) ) {

                    let child=process.argv[process.argv.indexOf('--child') + 1]
                    if(child){
                        data.path.child=child
                    }else {
                        data.path.child=''
                    }

                }
                try {
                    fs.writeFileSync(path.join(__dirname,'../../../../','api_builder/typeorm',PluralName+'.builder.json'),TemplateBuilder(data))
                }catch (e) {

                }
            }else {
                console.log('Please remove special chars in: '+name)
            }


        }
        else {
            console.log('Please give us the name of your entity')
        }
    }


}

//script: npm run swyger -- --build api
if ( ( process.argv && process.argv.indexOf('--build') ) ) {
    if(process.argv[process.argv.indexOf('--build') + 1]==='api'){
        BuildApi()
    }
}

process.exit(0)
