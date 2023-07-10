import {sendResultWithError} from "../../../send_result";

const deleteMany = async (service,name,req, res, next)=>{
  const option={ //this is for socket emission
    path:name+'/delete-many',
    function:'deleteMany'
  }
  await sendResultWithError(service,option,req,res,next)
}

export default deleteMany

