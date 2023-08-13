import axios from "axios";
const AxiosService={
  init:({API_KEY})=>{
    return async (method='post',path='/',data={},args={})=>{
      const accessToken=localStorage.getItem('accessToken')
      let headers={
        'Accept':'application/json',
        'Content-Type':'application/json', // 'Content-Type': 'multipart/form-data' for files
        'Access-Control-Allow-Origin':'*',
        'Access-Key':API_KEY,
        'Access-Control-Allow-Methods':'POST, GET, OPTIONS, PUT, DELETE, HEAD,PATCH',
        'Access-Control-Allow-Headers':'X-PINGOTHER, Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Max-Age':'1728000',
      }
      if(accessToken) headers['Authorization']='Bearer '+accessToken
      const url=path

      if(typeof data?.get=='function' && data?.get('file')){
        //https://stackoverflow.com/questions/43013858/how-to-post-a-file-from-a-form-with-axios
        headers['Content-Type']='multipart/form-data'
      }
      if(args?.headers){
        headers=Object.assign(
            ...headers,
            ...args.headers
        )
        delete args.headers
      }
      const config=Object.assign(
          {
            mode:'cors',
            method,
            url,
            data,
            headers,
          },
          args
      )

      let resp={}
      try {
        const result  =await axios(config)
        resp.data=result?.data?.data || result?.data
        if(result?.error)
          resp.error=result.error
        if(!resp.data) resp.data={}
      }catch (e) {
        resp.error=e.response?.data?.error || e.response?.error
        if(!resp.error) resp.error={}
      }

      return resp

    }
  }
}
export default AxiosService


