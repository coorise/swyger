import axiosService from "../../../remote/axios";

const sendMailMessage=async (data)=>{
    let response={}

    const resp =await axiosService(data)
    if(resp.data){
        response.data=resp.data
    }else if(resp.error){
        resp.error.message= 'Something went wrong with mail server'
        resp.error.name='mail'
        response.error=resp.error

    }

    return response
}

export default sendMailMessage