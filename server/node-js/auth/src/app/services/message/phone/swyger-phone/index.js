import axiosService from "../../../remote/axios";

const sendPhoneMessage=async (data)=>{
    let response={}

    const resp =await axiosService(data)
    if(resp.data && resp.data[0] && resp.data[0].code==='221'){
        response.data=resp.data
    }
    if(resp.error){
        resp.error.message= 'Something went wrong with phone server'
        resp.error.name='phone'
        response.error=resp.error

    }

    return response
}

export default sendPhoneMessage