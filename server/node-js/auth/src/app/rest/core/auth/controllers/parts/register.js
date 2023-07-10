import {sendResult} from "../../../../../helpers/send_result";

const register = async (service,name,req, res, next) => {

    const location={
        ipAddress:req.ip,
        user_agent:req.headers['user-agent']
    }
    const option={ //this is for socket emission
        path:name+'/register',
        function:'register',
        args: {location}
    }
    await sendResult(service,option,req,res,next)
};
export default register