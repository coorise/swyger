import axios from "axios";

const axiosService=async (data)=>{
    let response={}
    let error= {
        message: 'Something went wrong with server mail',
        code: 400,
        errors: []
    }
    let model
    try {

        data=Object.assign(
            {
                method: "post",
                url: "http://localhost:86/api/v1/mails/send-one",
                /*data:{
                    from: "user2@mail.192.168.1.14.nip.io",
                    to: "clemens.mayert64@ethereal.email",
                    subject: "register for user clemens",
                    body: "This is an example of mail sending to you.Thank for joining us!!!"
                } ,
                headers: {
                    //"Content-Type": "multipart/form-data",
                    //Authorization: `Bearer ${token}`
                },*/
            },
            data)
        let resp = await axios(data)
        if(resp?.data){
            model=resp.data
        }
        if(!resp.data) resp.data={}
    }catch (e) {
        let axiosError=e.response?.data?.error || e.response?.error
        error.errors.push(axiosError)
    }
    response.data=model
    if(error.errors.length>0){
        response.error=error
    }

    return response

}

export default axiosService