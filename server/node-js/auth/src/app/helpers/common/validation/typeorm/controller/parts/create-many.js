import {sendResult} from "../../../../../send_result";

const createMany =async (service,name,req, res, next)=>{
  const option={ //this is for socket emission
    path:name+'/create-many',
    function:'createMany',
    isValidation:true

  }
  await sendResult(service,option,req,res,next)
}
export default createMany
