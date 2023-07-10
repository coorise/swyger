import {sendResult} from "../../../../../../../helpers/send_result";

const verifyEmailCode = async (service,name,req, res, next) => {

    const option={ //this is for socket emission
        path:name+'/verify_email_code',
        function:'verifyEmailCode'
    }
    await sendResult(service,option,req,res,next)

};
export default verifyEmailCode
