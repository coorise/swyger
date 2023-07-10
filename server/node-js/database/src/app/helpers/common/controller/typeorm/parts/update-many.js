import {sendResultWithError} from "../../../../send_result";

const updateMany =async (service,name,req, res, next)=>{
  const option={ //this is for socket emission
    path:'/update',
    function:'updateMany'
  }
  await sendResultWithError(service,option,req,res,next)
}
export default updateMany
