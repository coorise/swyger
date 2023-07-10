import {sendResult} from "../../../../../helpers/send_result";

const resetPassword = async (service,name,req, res, next) => {

    const option={ //this is for socket emission
        path:name+'/reset_password',
        function:'resetPassword'
    }
    await sendResult(service,option,req,res,next)
};
export default resetPassword