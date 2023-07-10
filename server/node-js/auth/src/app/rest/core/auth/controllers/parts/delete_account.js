import {sendResult, sendResultWithError} from "../../../../../helpers/send_result";

const deleteAccount = async (service,name,req, res, next) => {
    const option={ //this is for socket emission
        path:name+'/delete_account',
        function:'deleteAccount'
    }
    await sendResultWithError(service,option,req,res,next)
};
export default deleteAccount