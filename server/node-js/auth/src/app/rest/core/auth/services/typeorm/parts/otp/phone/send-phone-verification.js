import userService from '../../../../../../users/services/typeorm/users.service';
import sendPhoneMessage from "../../../../../../../../services/message/phone/swyger-phone";
import convertToMillis from "ms";
import HTTP_RESPONSE_CODE from "../../../../../../../../helpers/all-http-response-code";

const authAdminToken=process.env.AUTH_ADMIN_TOKEN;
const sendPhoneVerification = async (entities,data,args) => {

    const {extApi}=args
    const axiosData={
        url:'',
        data:{},
        headers: {
            //"Content-Type": "multipart/form-data",
            //Authorization: `Bearer ${token}`
        },
    }
    let response={}
    let errors= []
    let error= {
        message: HTTP_RESPONSE_CODE.MESSAGE._400,
        code: HTTP_RESPONSE_CODE.ERROR_FROM_USER_CODE,
        errors: []
    }
    let model
    const expireIn=process.env.OPT_CODE_EXPIRATION
    const addedTime=convertToMillis(expireIn); //in millisecond so it will expires
    const readableTime=convertToMillis(addedTime,{long:true}) //eg output: 5 minutes

    const {email,numberPhone}=data
    const mUser = await userService.findOne(entities,{
        email,
        numberPhone
    });
    let user=mUser.data
    if (!user) {
        errors.push(`User not found with data: phone ${numberPhone} and email ${email}`)
    }
    else {
        // @ts-ignore
        //user.phoneCode = utils.randomVerfiedCode();
        // @ts-ignore
        //user.phoneCodeExpires = Date.now() + addedTime

        //await userService.updateOne(entities,user);



        // @ts-ignore
        const phoneService =await sendPhoneMessage(
            {
                url:extApi.url,
                data:{
                    data:{
                        //from:'',
                        // @ts-ignore
                        to:user.numberPhone,
                        // @ts-ignore
                        /*message:`Hello ${user.numberPhone},
                         you requested a phone verification code.
                         Here is the code : ${// @ts-ignore
                            user.phoneCode}.
                         This code expires in ${readableTime}.
                         If you didn't make this request, please just ignore this phone.
                         Thanks for your concern.
                         Agglomy.
                        `*/
                    }
                },
                headers: {
                    //"Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${extApi.token}`,
                    "Access-Key":authAdminToken,
                }
            }
        )
        if(phoneService.error){
            errors=[...errors,...phoneService.error?.errors]
        }else {
            model={
                message:`Message code was sent to : ${user.numberPhone}, valid for 3min`
            }
        }
    }


    // @ts-ignore
    response.data=model
    if(errors.length>0){
        response.error=error
        response.error.errors=errors
    }
    if(mUser.error){
        if(mUser.error.errors){
            response.error.errors=[...response.error.errors,mUser.error.errors]
        }
        if(mUser.error.node){
            response.error.message=HTTP_RESPONSE_CODE.MESSAGE._500
            response.error.code=HTTP_RESPONSE_CODE.INTERNAL_ERROR_CODE
            response.error.node= {msg:'Internal error with server to /send-phone-verification'}
        }
    }

    return response
};

export default sendPhoneVerification
