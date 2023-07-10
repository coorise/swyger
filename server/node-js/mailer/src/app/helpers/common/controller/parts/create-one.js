import {sendResult} from "../../../send_result";

const createOne =async (service,name,req, res, next)=>{
  const option={ //this is for socket emission
    path:name+'/create-one',
    function:'createOne'
  }
  await sendResult(service,option,req,res,next)
}
export default createOne
