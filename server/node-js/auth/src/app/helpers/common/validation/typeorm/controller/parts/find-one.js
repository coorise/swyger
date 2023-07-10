import {sendResult} from "../../../../../send_result";

const findOne = async (service,name,req, res, next)=>{
  const option={ //this is for socket emission
    path:name+'/find-one',
    function:'findOne'
  }
  await sendResult(service,option,req,res,next)

}

export default findOne
