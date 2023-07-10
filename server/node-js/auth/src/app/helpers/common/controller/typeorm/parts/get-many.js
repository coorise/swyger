import { sendResultWithError} from "../../../../send_result";


const findMany = async (service,name,req, res, next)=>{
  const option={ //this is for socket emission
    path:'/get',
    function:'findMany'
  }
  await sendResultWithError(service,option,req,res,next)
}

export default findMany
