import {sendResult} from "../../../../../../../helpers/send_result";

const sendPhoneVerification = async (service,name,req, res, next) => {

    const extApi={
        url:req.phoneServerUrl+'/phones/admin/send-one',
        token:req.authAdminToken
    }
    const option={ //this is for socket emission
        path:name+'/admin/send_phone_verification',
        function:'sendPhoneVerification',
        args: {extApi}
    }
    await sendResult(service,option,req,res,next)
};
export default sendPhoneVerification