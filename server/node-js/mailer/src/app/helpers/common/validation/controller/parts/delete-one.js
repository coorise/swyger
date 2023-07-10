import {sendResult} from "../../../../send_result";

const deleteOne = async (service,name,req, res, next)=>{
  const option={ //this is for socket emission
    path:name+'/delete-one',
    function:'deleteOne',
    isValidation:true
  }
  await sendResult(service,option,req,res,next)
}

export default deleteOne

