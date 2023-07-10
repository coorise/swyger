import {sendResult} from "../../../../../helpers/send_result";

const updateAccount = async (service,name,req, res,next) => {

    const option={ //this is for socket emission
        path:name+'/update-account',
        function:'updateAccount',
    }
    await sendResult(service,option,req,res,next)

};

export default updateAccount