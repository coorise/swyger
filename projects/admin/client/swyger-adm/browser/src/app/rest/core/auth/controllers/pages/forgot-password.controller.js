const ForgotPasswordController = async (args) =>{
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
    title: 'Forgot Password | Aminuty',
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
    index:'pages/forgot-password.html',
  }
  let data= {

      res:'',

      error:{
          email:'',
      },
      forgotPassword(){
          //e.preventDefault(); // Otherwise the form will be submitted

          if(!this.user.email){
              console.log('email is empty');
              this.error.email= '(email is empty)';
          }else{
              this.error.email= '';
          }
          if(!this.user.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
              console.log('give us a valid email address');
              this.error.email= '(Please give us valid email address)';
          }else{
              this.error.email= '';
          }


          if(this.user.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
          ){
              console.log('All Fields are completed');
              let mUser ={
                  email:this.user.email
              }
              this.res=client?.auth?.auth()?.sendResetPasswordEmail(mUser).val()

              if(this.res.code === 404){
                  console.log('Error Code From AuthController')
                  console.log(this.res.code)
                  console.log('Error Message From AuthController')
                  console.log(this.res.message)
                  this.error.email= '(No users found with this email)';
              }else {
                  console.log('The response sendForgot Pass from Auth: ')
                  console.log(this.res.res)
                  let email=this.res.res.user.email
                  localStorage.setItem('email',email);
                  //Route('auth','reset-password')
              }

          }
      },
  }
  await controller.render({data, meta,views})
}
export default ForgotPasswordController
