import userService from "../../../../users/services/typeorm/users.service";
import bcrypt from "bcryptjs";
import HTTP_RESPONSE_CODE from "../../../../../../helpers/all-http-response-code";

const updateAccount = async (entities,user, args) => {
    const {location}=args
    let response={}
    let errors= []
    let error= {
        message: HTTP_RESPONSE_CODE.MESSAGE._400,
        code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
    }
    let model

    delete user.isEmailFromLocal

    const {uid} = user
    const mData = await userService.findOne(entities,{
        uid:uid
    });
    if(mData.data){
        let data=Object.assign({},mData.data)

        if(user.password){
            if(!await data.verifyPassword(user.password)){
                if(await data.verifyPassword(user.oldPassword)){
                    data.password = await bcrypt.hash(user.password, 10);

                } else {
                    errors.push({
                        msg:'The password does not match with the old one '
                    })
                }
            }else {
                errors.push({
                    msg:'The new password  is same with the old one '
                })

            }
            delete user.password
            delete user.oldPassword
            if(errors.length>0){
                response.error=error
                response.error.errors=errors
                return response
            }

        }
        if(user.email){
            if(user.email !== data.email){
                data.email=user.email
                data.isEmailVerified=false
            }else {
                errors.push({
                    msg:'The new email  is same with the old one '
                })

            }
            delete user.email
            if(error.errors.length>0){
                response.error=error
                response.error.errors=errors
                return response
            }
        }
        if(user.numberPhone){
            if(user.numberPhone !== data.numberPhone){
                data.numberPhone=user.numberPhone
                data.isPhoneVerified=false
            }else {
                error.errors.push({
                    msg:'The new number phone  is same with the old one '
                })

            }
            delete user.numberPhone
            if(errors.length>0){
                response.error=error
                response.error.errors=errors
                return response
            }


        }
        //console.log('update-account ', data)
        user=Object.assign(data,user)
        data= await userService.updateOne(entities,user)
        data=Object.assign({},data.data)

        delete data.password
        // @ts-ignore
        delete data.resetPasswordToken;
        // @ts-ignore
        delete data.resetPasswordExpires;

        // @ts-ignore
        delete data.temporaryPassword;
        delete  data.verifyPassword
        delete data.emailCode
        delete data.phoneCode
        delete data.passwordCode
        delete data.emailCodeExpires
        delete data.passwordCodeExpires
        delete data.phoneCodeExpires

        model=data

    } else {
        errors.push({
            msg:'The uid user does not exist: '+uid
        })
    }

    // @ts-ignore
    response.data=model
    if(errors.length>0){
        response.error=error
        response.error.errors=errors
    }
    if(mData.error){
        if(mData.error?.errors){
            response.error.errors=[...response.error.errors,mData.error.errors]
        }
        if(mData.error?.node){
            response.error.message=HTTP_RESPONSE_CODE.MESSAGE._500
            response.error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
            response.error.node= {msg:'Internal error with server to /update-account'}
        }
    }

    return response

};
export default updateAccount
