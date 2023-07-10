import {sendResult} from "../../../../../send_result";

const updateMany =async (service,name,req, res, next)=>{
  const option={ //this is for socket emission
    path:name+'/update-one',
    function:'updateMany',
    isValidation:true
  }
  await sendResult(service,option,req,res,next)
}
export default updateMany
