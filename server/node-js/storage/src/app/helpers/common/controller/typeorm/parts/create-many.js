import {sendResultWithError} from "../../../../send_result";

const createMany =async (service,name,req, res, next)=>{
  const option={ //this is for socket emission
    path:'/create',
    function:'createMany'
  }
  await sendResultWithError(service,option,req,res,next)
}
export default createMany
