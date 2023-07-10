import generateToken from "./subs/generate-token";
import refreshLoginToken from "./subs/refresh-login-token";
import userService from "../../../../users/services/typeorm/users.service";
import HTTP_RESPONSE_CODE from "../../../../../../helpers/all-http-response-code";
import ALL_AUTH_CODE from "../../../../../../helpers/all-auth-code";


const login = async (entities,user, args) => {
    const {location}=args
    let response={}
    let node
    let errors= []
    let mData
    let error= {
        message: HTTP_RESPONSE_CODE.MESSAGE._400,
        code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
        errors:[]
    }
    let model
    const {email,password} = user
    if(!(email && password)){
        error=ALL_AUTH_CODE["604"]
        errors.push({
            msg:'Verify your field (email,password)!'
        })
    }else {
        mData = await userService.findOne(entities,{
            email:email
        });
        if(mData.data){
            const data=Object.assign({},mData.data)
            if(await data.verifyPassword(password)){
                delete data.password
                delete data.resetPasswordToken;
                delete data.resetPasswordExpires;
                delete data.temporaryPassword;
                delete  data.verifyPassword
                delete  data.extras
                delete data.emailCode
                delete data.phoneCode
                delete data.passwordCode
                delete data.emailCodeExpires
                delete data.passwordCodeExpires
                delete data.phoneCodeExpires
                const token = generateToken(Object.assign({},data));

                let refreshToken = await refreshLoginToken(entities,data, location);

                if(refreshToken.error){
                    error.errors.push(refreshToken.error)
                    error.code=401
                    model={data:false,token:false,refreshToken:false,message:refreshToken.error}
                }else {
                    model={data:data, token:token, refreshToken: refreshToken?.data?.token}
                }

            }
            else {
                error=ALL_AUTH_CODE["601"]
                errors.push({
                    msg:'Verify your password!'
                })
            }

        }
        else {
            error=ALL_AUTH_CODE["600"]
            errors.push({
                msg:'This Email does not exist: '+email+'!'
            })
        }
        response.data=model
    }


    if(errors.length>0){
        response.error=error
        response.error.errors=errors
    }
    if(mData.error){
        if(mData.error?.errors){
            response.error.errors=[...response.error.errors,mData.error.errors]
        }
        if(mData.error?.node){
            response.error=ALL_AUTH_CODE["500"]
            response.error.node= {msg:'Internal error with server to /login'}
        }
    }

    return response

};
export default login
