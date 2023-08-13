const UpdatePasswordController = (userModel, authService) => {
    return {
        title: 'Reset Password | Aminuty',
        user: userModel,
        email:(localStorage.getItem('email'))?localStorage.getItem('email'):'',
        auth: authService,
        res:'',
        token:'',

        error:{
            token:'',
            password:'',
            password_length:'',
            password_digit:'',
            password_specialChar:'',
        },
        resetPassword(){
            //e.preventDefault(); // Otherwise the form will be submitted

            if(!this.token){
                console.log('username is empty');
                this.error.token= '(code is empty)';
            } else{
                this.error.token= '';
            }

            if(this.user.password.length<8){
                console.log('password is too short');
                this.error.password_length= '(password is too short min <= 8 )';
            }else{
                this.error.password_length= '';
            }

            if(this.user.password.search(/[0-9]/) < 0){
                console.log('password must contain 1 digit');
                this.error.password_digit= '(password must contain at least 1 digit [0-9])';
            }else{
                this.error.password_digit= '';
            }
            if(this.user.password.search(/[!@#$%^&*]/) < 0){
                console.log('password must contain 1 special character');
                this.error.password_specialChar= '(password must contain at least 1 special character [!@#$%^&*])';
            }else{
                this.error.password_specialChar= '';
            }


            if(this.token
                &&this.user.password
                && this.user.password.length>=8
                && (this.user.password.search(/[0-9]/) >0
                    && this.user.password.search(/[!@#$%^&*]/) > 0)
            ){
                console.log('All Fields are completed');
                var mUser ={
                    token:this.token,
                    password:this.user.password
                }
                this.res=this.auth.resetPassword(mUser)

                if(this.res.code === 401){
                    console.log('Error Code From AuthController')
                    console.log(this.res.code)
                    console.log('Error Message From AuthController')
                    console.log(this.res.message)
                    this.error.token= '(Password Reset Failed , token expired. Go to forgot page)';
                }else {
                    console.log('The response is refresh token from Auth: ')
                    console.log(this.res)
                    //Route('auth','login')
                }

            }
        },
    }
}
export default UpdatePasswordController
