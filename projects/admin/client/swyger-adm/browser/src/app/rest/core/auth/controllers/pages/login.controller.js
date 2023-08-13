import {ErrorLoginValidation,LoginValidation} from "../../validations/login.validation.js";
const LoginController = async (args)=>{
  const {req,controller}=args;
  //console.log('path : ', req.path)
  //console.log('query : ', req.query)
  //console.log('param : ', req.param)
  const router=req.$router
  //router?.go('/')
  //router.back('path')
  //router.mount('path',function)
  //router.off('path')
  //router.reload()
  const client=req.client

  let meta={
    title:"Login | Agglomy !",
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
    index:'pages/login.html',
  }
  let auth=client?.auth?.auth()
  let data={
    user: controller?.authModel,
    error: ErrorLoginValidation,
    clientError:'',
    async loginUser(){
      //e.preventDefault(); // Otherwise the form will be submitted
      try {
        let validation = LoginValidation(this.user,this.error)

        if(validation === 'ok'){
          if(ENV==='dev') console.log('All Fields are completed');
          let mUser={email:this.user.email,password:this.user.password}
          let response= await auth.login(mUser).val()
          if(response?.error){
            let authError=response?.error?.auth
            switch (authError?.code) {
              case 600:
                this.clientError= authError?.message || 'This User does not exit!'
                break;
              case 601:
                this.clientError= authError?.message || 'Verify your Password!'
                break;

            }
          }else if (response?.data?.data){
            this.clientError= ''
            //let result=response?.data
            //result?.data //for user info
            //result?.refreshToken //for refresh token
            //result?.token //for  token
            router.go('/')
          } else if(!response?.error && !response?.data?.token){
            this.clientError= 'We noticed you are already logged in from another device.For security reason, we have sent a verification code to: '+this.user?.email
            router.go('/auth/verify-token-code?email='+this.user.email+'&message='+this.clientError)
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

export default LoginController
