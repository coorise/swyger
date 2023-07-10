import {sendResult} from "../../../../../helpers/send_result";

const refreshToken = async (service,name,req, res, next) => {

    const location={
        ipAddress:req.ip,
        user_agent:req.headers['user-agent']
    }
    const option={ //this is for socket emission
        path:name+'/refresh-token',
        function:'refreshToken',
        args: {location}
    }
    await sendResult(service,option,req,res,next)
};
export default refreshToken