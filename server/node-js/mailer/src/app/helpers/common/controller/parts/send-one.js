import {sendResult} from "../../../send_result";

const sendOne =async (service, name, req, res, next)=>{
  const option={ //this is for socket emission
    path:name+'/send-one',
    function:'sendOne'
  }
  await sendResult(service,option,req,res,next)
}
export default sendOne
