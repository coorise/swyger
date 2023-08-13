const VerifyEmailCodeController = (userModel, authService) => {
    return {
        title: 'Verify Email | Aminuty',
        user: '',
        auth: authService,
        res:'',
        token:'',

        error:{
            token:'',
        },
        verifyEmail(){
            this.mToken=(localStorage.getItem("tokens"))? JSON.parse(localStorage.getItem("tokens")).access.token:''

            if(!this.token){
                console.log('username is empty');
                this.error.token= '(code is empty)';
            } else{
                this.error.token= '';
            }

            if(this.token){
                console.log('All Fields are completed');
                var mToken ={
                    token:this.token,
                }
                this.res=this.auth.verifyEmail(mToken)

                if(this.res.code === 401){
                    console.log('Error Code From AuthController')
                    console.log(this.res.code)
                    console.log('Error Message From AuthController')
                    console.log(this.res.message)
                    this.error.token= '(Verify Email Failed , token expired. Go to forgot page)';
                }else {
                    console.log('The response is refresh token from Auth: ')
                    console.log(this.res)
                    var mUser = {
                        email:this.user.email,
                        id:this.user.id,
                        isEmailVerified:true,
                        name:this.user.name,
                        role:this.user.role,
                    }

                    localStorage.setItem('user',JSON.stringify(mUser));
                    //Route('home','')



                }

            }
        },
    }
}
export default VerifyEmailCodeController
