const rootApi = process.env.API_PATH ||'/api/v1';
const getDataFromRequest=(req)=>{
    let response={}
    let socket=req.publicSocket
    let listen=rootApi+'/on/'
    let path=''
    let data={}
    let result={}
    try {
        if(req.query?.query){
            data=Object.assign({},JSON?.parse(req.query?.query))
        }else {
            data={
                data:{
                    ...req.query
                }
            }
        }

        if(!data?.data || !Object.keys(data?.data)?.length>0) data={data:req.body}

        path=req?.originalUrl?.replace(rootApi+'/','')?.replace(/\?.*/,'')

    }catch (e) {

    }


    //We remove private path
    let socketPath=path?.replace(/\/ps.*?pe/g,'')

    let customPath=socketPath?.split('/');
    let start=customPath?.shift();
    if(start===''){
        start=customPath?.shift()
    }
    let end=customPath.pop()
    let extras='base'
    if(customPath?.length>0){
        extras='/'+customPath?.reduce((prev,current)=>prev+'/'+current)
        if(extras.charAt(0)!=='/') extras='/'+extras

    }
    path=path
        ?.replace(/-one$/,'')
        ?.replace(/-many$/,'')

    return {
        data,
        listen,
        socket,
        path,
        response,
        result,
        extras,
        start,
        end

    }
}
export default getDataFromRequest