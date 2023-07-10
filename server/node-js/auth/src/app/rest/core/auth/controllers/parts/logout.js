import {sendResult, sendResultWithError} from "../../../../../helpers/send_result";

const logout = async (service,name,req, res, next) => {
    const option={ //this is for socket emission
        path:name+'/logout',
        function:'logout'
    }
    await sendResultWithError(service,option,req,res,next)
};
export default logout