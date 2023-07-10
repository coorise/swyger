import {sendResultWithError} from "../../../../send_result";

const deleteMany = async (service,name,req, res, next)=>{
  const option={ //this is for socket emission
    path:'/delete',
    function:'deleteMany'
  }
  await sendResultWithError(service,option,req,res,next)
}

export default deleteMany

