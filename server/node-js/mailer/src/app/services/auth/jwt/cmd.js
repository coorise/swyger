import  fs from "fs";
import path from "path";
import jwt from "./jwt"

const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

//script: npm run generate:key -- --secret my_secret_key --payload {"field1":"value1"} --with-env
if ( ( process.argv && process.argv.indexOf('--secret') ) ) {
    let secret=process.argv[process.argv.indexOf('--secret') + 1]
    let expires
    if ( (process.argv.indexOf('--expires-in') !== -1 ) ){
        expires=name=process.argv[process.argv.indexOf('--name') + 1]
    }
    if(secret?.length>0){
        if(!specialChars.test(secret)){
            let fields
            if ( (process.argv.indexOf('--payload') !== -1 ) ){
                fields=name=process.argv[process.argv.indexOf('--payload') + 1]
            }
            if(typeof fields !=='object'){
                fields={}
            }
            let config={
                secret
            }
            if(expires)config.expires=expires
            let token=jwt.sign_cmd(fields,config)
            console.log('Your generated token is: ',token)

            if(( process.argv && process.argv.indexOf('--with-env') ) ){
                let file=path.join(__dirname,'../../../../../','.env')
                if(fs.existsSync(file)){
                    let env=fs.readFileSync(file,{encoding:'utf8', flag:'r'})
                    if(env.includes('AUTH_ADMIN_TOKEN=')){
                        env=env.replace(/AUTH_ADMIN_TOKEN=.*?\n/,'AUTH_ADMIN_TOKEN='+token+'\n')
                    }else {
                        env=`${env}AUTH_ADMIN_TOKEN=${token}
                        `
                    }
                    fs.writeFileSync(file,env)
                }else {
                    console.log('we did not see .env file at the root of your project!')
                }
            }
        }else {
            console.log('Please remove special chars in: '+secret)
        }
    }else {
        console.log('Please give us a secret key(min 1 character)!')
    }


}
process.exit(0)