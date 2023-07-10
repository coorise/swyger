import {sendResult} from "../../../../../../../helpers/send_result";

const verifyPhoneCode = async (service,name,req, res, next) => {

    const extApi={
        url:req.phoneServerUrl+'/phones/admin/verify-one',
        token:req.authAdminToken
    }
    const option={ //this is for socket emission
        path:name+'/admin/verify_phone_code',
        function:'verifyPhoneCode',
        args: {extApi}
    }
    await sendResult(service,option,req,res,next)
};
export default verifyPhoneCode