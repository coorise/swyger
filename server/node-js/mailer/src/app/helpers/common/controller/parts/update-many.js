import {sendResultWithError} from "../../../send_result";

const updateMany =async (service,name,req, res, next)=>{
  const option={ //this is for socket emission
    path:name+'/update-many',
    function:'updateMany'
  }
  await sendResultWithError(service,option,req,res,next)
}
export default updateMany
