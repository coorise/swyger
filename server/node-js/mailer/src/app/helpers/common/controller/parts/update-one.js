import {sendResult} from "../../../send_result";

const updateOne =async (service,name,req, res, next)=>{
  const option={ //this is for socket emission
    path:name+'/update-one',
    function:'updateOne'
  }
  await sendResult(service,option,req,res,next)
}
export default updateOne
