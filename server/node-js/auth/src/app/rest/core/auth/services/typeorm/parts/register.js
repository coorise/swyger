import bcrypt from "bcryptjs";
import generateToken from "./subs/generate-token";
import generateRefreshToken from "./subs/generate-refresh-token";
import HTTP_RESPONSE_CODE from "../../../../../../helpers/all-http-response-code";
import ALL_AUTH_CODE from "../../../../../../helpers/all-auth-code";

import userService from "../../../../users/services/typeorm/users.service";



const register = async (entities,data,args) => {
    const {location}=args
    let response={}
    let model
    let errors= []
    let error= {
        message: HTTP_RESPONSE_CODE.MESSAGE._400,
        code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
    }
    let mUser

    if(!(data.email && data.password)){
        error=ALL_AUTH_CODE["604"]
        errors.push({
            msg:'Verify your field (email,password)!'
        })
    }else {
        mUser = await userService.findOne(entities,{
            email: data.email
        });
        if(mUser.data){
            error=ALL_AUTH_CODE["602"]
            errors.push({
                msg:'Sorry,this Email already exists: '+mUser.data.email
            })
        }
        else{

            data.password = await bcrypt?.hash(data.password, 10);
            let saveUser= await userService.createOne(entities,data)
            let user=Object.assign({},saveUser.data)
            delete user.password
            delete user.resetPasswordToken;
            delete user.resetPasswordExpires;
            delete user.temporaryPassword;
            delete  user.verifyPassword
            delete  data.extras
            delete user.emailCode
            delete user.phoneCode
            delete user.passwordCode
            delete user.emailCodeExpires
            delete user.passwordCodeExpires
            delete user.phoneCodeExpires

            const token = generateToken(Object.assign({},user));
            location.isPrimaryToken=true
            location.isTokenVerified=true
            let refreshToken = await generateRefreshToken(entities,user, location);
            refreshToken=Object.assign({},refreshToken?.data)

            const getKeys=Object.keys(user)
            getKeys.forEach((key)=>{
                if(typeof user[key] === 'function'){
                    delete user[key]
                }
            })

            model = {
                data:user,
                token:token,
                refreshToken:refreshToken?.token
            };
        }

        response.data=model
    }


    if(errors.length>0){
        response.error=error
        response.error.errors=errors
    }
    if(mUser.error){
        if(mUser.error?.errors){
            response.error.errors=[...response.error.errors,mUser.error.errors]
        }
        if(mUser.error?.node){
            response.error=ALL_AUTH_CODE["500"]
            response.error.node= {msg:'Internal error with server to /register'}
        }
    }

    return response
};

export default register
