import {ErrorLoginValidation, LoginValidation} from "../../validations/login.validation.js";
const SetNewPasswordController = async (args)=>{
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
    title:"Auth Set New Password | Agglomy !",
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
    index:'pages/verify-code.html',
  }

  let data={
    message:req.query?.message||'',
    page:'',
    user: {
      email:req.query?.email,
      password:''
    },
    error: ErrorLoginValidation,
    clientError:'',
    async verifyCode(){
      //e.preventDefault(); // Otherwise the form will be submitted
      try {
        let validation = LoginValidation(this.user,this.error)

        if(validation === 'ok'){
          if(ENV==='dev') console.log('All Fields are completed');
          let mUser={email:this.user.email,password:this.user.password}
          let response= await client?.auth().verifyTokenCode(mUser).val()
          if(response?.error){
            let authError=response?.error?.auth
            switch (authError?.code) {
              case 600:
                this.clientError= authError?.message || 'This User does not exit!'
                break;
              case 607:
                this.clientError= authError?.message || 'Code is Not Still Verified!'
                break;

            }
          }else if (response?.data?.data){
            this.clientError= ''
            //let result=response?.data
            //result?.data //for user info
            //result?.refreshToken //for refresh token
            //result?.token //for  token
            req.go()
          } else if(!response?.data?.token){
            this.clientError= 'We noticed you are already logged in from another device.For security reason, we have sent a verification code to: '+this.user?.email
          }


        }
      }catch (e) {
        if(ENV==='dev')
          console.log(e);
      }

    },
    refreshToken(){

    }


  }
  await controller.render({data, meta,views})
}

export default SetNewPasswordController
