import {sendResult} from "../../../../../send_result";

const deleteMany = async (service,name,req, res, next)=>{
  const option={ //this is for socket emission
    path:name+'/delete-many',
    function:'deleteMany',
    isValidation:true
  }
  await sendResult(service,option,req,res,next)
}

export default deleteMany

