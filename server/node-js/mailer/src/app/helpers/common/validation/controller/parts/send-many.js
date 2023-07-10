import {sendResult} from "../../../../send_result";

const sendMany =async (service, name, req, res, next)=>{
  const option={ //this is for socket emission
    path:name+'/send-many',
    function:'sendMany',
    isValidation:true

  }
  await sendResult(service,option,req,res,next)
}
export default sendMany
