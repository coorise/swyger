const SendEmailCode = (userModel, authService) =>{
    return {
        title: 'Forgot Password | Aminuty',
        user: userModel,
        auth: authService,
        res:'',

        error:{
            email:'',
        },
        sendEmail(){
            //e.preventDefault(); // Otherwise the form will be submitted

            if(!this.user.email){
                //console.log('email is empty');
                this.error.email= '(email is empty)';
            }else{
                this.error.email= '';
            }
            if(!this.user.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
                //console.log('give us a valid email address');
                this.error.email= '(Please give us valid email address)';
            }else{
                this.error.email= '';
            }


            if(this.user.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
            ){
                //console.log('All Fields are completed');
                let mUser ={
                    email:this.user.email
                }
                this.res=this.auth.sendResetPasswordEmail(mUser)

                if(this.res.code === 404){
                    /*console.log('Error Code From AuthController')
                    console.log(this.res.code)
                    console.log('Error Message From AuthController')
                    console.log(this.res.message)*/
                    this.error.email= '(No users found with this email)';
                }else {
                    /*console.log('The response sendForgot Pass from Auth: ')
                    console.log(this.res.res)*/
                    let email=this.res.res.user.email
                    localStorage.setItem('email',email);
                    //Route('auth','reset-password')
                }

            }
        },
    }
}
export default SendEmailCode
