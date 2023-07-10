import {sendResult} from "../../../../../../../helpers/send_result";

const sendForgotPassword = async (service,name,req, res, next) => {

    const extApi={
        url:req.mailServerUrl+'/mails/admin/send-one',
        token:req.authAdminToken
    }
    const option={ //this is for socket emission
        path:name+'/send_forgot_password',
        function:'sendForgotPassword',
        args: {extApi}
    }
    await sendResult(service,option,req,res,next)
};
export default sendForgotPassword