import {sendResult} from "../../../../../../../helpers/send_result";

const verifyTokenCode = async (service,name,req, res, next) => {

    const location={
        ipAddress:req.ip,
        user_agent:req.headers['user-agent']
    }
    const option={ //this is for socket emission
        path:name+'/verify_token_code',
        function:'verifyTokenCode',
        args:{location}
    }
    await sendResult(service,option,req,res,next)
};
export default verifyTokenCode