import {sendResult} from "../../../../../helpers/send_result";

const login = async (service,name,req, res,next) => {
    const ipAddress = (req.ip) ? req.ip: "0.0.0.0";
    const location={
        ipAddress:req.ip,
        user_agent:req.headers['user-agent'],
        url:req.mailServerUrl+'/mails/admin/send-one',
        token:req.authAdminToken,
        geoIp:await req.geoIp?.getLocationNpm(ipAddress),
        useragent:req.useragent
    }
    const option={ //this is for socket emission
        path:name+'/login',
        function:'login',
        args:{location}
    }
    await sendResult(service,option,req,res,next)

};

export default login