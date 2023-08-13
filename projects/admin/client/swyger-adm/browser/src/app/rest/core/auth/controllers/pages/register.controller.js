import {ErrorRegisterValidation,RegisterValidation} from "../../validations/register.validation.js";
const RegisterController = async (args)=>{
  const {req,controller}=args;
  //req.io.auth.socket.privateClient=true
  //controller.client.io=req.io
  //console.log('path : ', req.path)
  //console.log('query : ', req.query)
  //console.log('param : ', req.param)
  const router=req.$router
  //router.go('/')
  //router.back('path')
  //router.mount('path',function)
  //router.off('path')
  //router.reload()
  const client=req.client
  let meta={
    title:"Register | Agglomy !",
    meta: [
      {
        name: "child value",
        content: "child content value"
      },
    ]
    // name:"Name"
  }

  const views={
    // that is a way to import your template
    // the let is the name and right side is the path
    //so on your parent template, use  eg: <index/>
    index:'pages/register.html',
  }


  /*localStorage.setItem('accessToken','mmm')
  localStorage.setItem('refreshToken',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOnsiZXh0cmFzIjpudWxsLCJhY2ViYXNlVG9rZW4iOm51bGwsImVtYWlsIjoidXNlcjFAZ21haWwuY29tIiwic3RhdHVzIjoib2ZmbGluZSIsImlzRW1haWxGcm9tTG9jYWwiOmZhbHNlLCJpc0VtYWlsVmVyaWZpZWQiOmZhbHNlLCJpc1Bob25lVmVyaWZpZWQiOmZhbHNlLCJpc1Bhc3NDb2RlVmVyaWZpZWQiOmZhbHNlLCJlbWFpbENvZGUiOm51bGwsInBob25lQ29kZSI6bnVsbCwicGFzc3dvcmRDb2RlIjpudWxsLCJudW1iZXJQaG9uZSI6bnVsbCwiZW1haWxDb2RlRXhwaXJlcyI6bnVsbCwicGFzc3dvcmRDb2RlRXhwaXJlcyI6bnVsbCwicGhvbmVDb2RlRXhwaXJlcyI6bnVsbCwiaWQiOiI2M2NkYTBhNjcwMjVlNjMzYTQ2ODA3NzIiLCJ1aWQiOiJkNmJhZjljMy0zMTRhLTQxZWMtYTQzZi1kODk1ZGRkODY5NzYiLCJjcmVhdGVkQXQiOiIyMDIzLTAxLTIyIDEyOjMwIiwidXBkYXRlZEF0IjoiMjAyMy0wMS0yMiAxMjozMCJ9LCJpYXQiOjE2NzQ2ODM5MjAsImV4cCI6MTY3OTg2NzkyMH0.lS6q_cMD-sdNxlPOA7S6QVU5nAO2k0s5ozZrYTEqq9M'
  )*/


  let data={
    user: controller.authModel,
    confirm_password:'',
    error:ErrorRegisterValidation,
    clientError:'',
    async registerUser(){
      //e.preventDefault(); // Otherwise the form will be submitted
      try{
        let validation = RegisterValidation(this.user,this.confirm_password,this.error)
        if( validation === 'ok'){
          if(ENV==='dev') console.log('All Fields are completed');
          let mUser={
            //username:this.user.username,
            email:this.user.email,
            password:this.user.password
          }
          let response=await client?.auth?.auth().register(mUser).val()
          if(response?.error){
            let authError=response?.error?.auth
            switch (authError?.code) {
              case 602:
                this.clientError=authError?.message || 'Sorry,this Email already exists!'
                break;

            }
          }else if (response?.data?.data){
            this.clientError=''
            //let result=response?.data
            //result?.data //for user info
            //result?.refreshToken //for refresh token
            //result?.token //for  token
            router.go()
          }
        }
      }catch (e) {
        if(ENV==='dev')
          console.log(e);
      }
    },

  }
  await controller.render({data, meta,views})
}

export default  RegisterController
