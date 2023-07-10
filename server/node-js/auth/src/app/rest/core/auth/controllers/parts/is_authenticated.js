import {sendResult} from "../../../../../helpers/send_result";

const isAuthenticated =async (service,name,req, res, next) => {
    try {

        const option={ //this is for socket emission
            path:name+'/is-authenticated',
            function:'isAuthenticated'
        }
        await sendResult(service,option,req,res,next)
    } catch (exception) {
        next(exception);
    }
};
export default isAuthenticated