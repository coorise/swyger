import {sendResult} from "../../../../send_result";


const findMany = async (service,name,req, res, next)=>{
  const option={ //this is for socket emission
    path:name+'/find-many',
    function:'findMany',
    isValidation:true
  }
  await sendResult(service,option,req,res,next)
}

export default findMany
