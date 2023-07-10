import {sendResult} from "../../../../../helpers/send_result";

const user = async (service,name,req, res,next) => {

    const option={ //this is for socket emission
        path:name+'/user',
        function:'user',
    }
    let data = {}
    if(req.query?.query){
        try {

            data=Object.assign({},JSON?.parse(req.query?.query));
            if(!data?.data?.uid) data.data={uid:req?.user?.uid}
            req.query.query=JSON.stringify(data)
        }catch (e) {

        }
    }
    if(!data?.data){
        if(!req.body?.data?.uid) req.body.data={uid:req?.user?.uid}
    }

    if(!data?.data){
        if(!req.params?.data?.uid) req.params.data={uid:req?.user?.uid}
    }

    await sendResult(service,option,req,res,next)
}
export default user