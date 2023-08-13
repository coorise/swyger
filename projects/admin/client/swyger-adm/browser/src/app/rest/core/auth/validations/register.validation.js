let ErrorRegisterValidation = {
    style:{
        color:'red',
        display:'none',
    },
    email:'',
    password:'',
    password_length:'',
    password_digit:'',
    password_specialChar:'',
}

const RegisterValidation =(user,confirm_password,error)=>{
    if(!user.username){
        console.log('username is empty');
        error.username= '(username is empty)';
    } else{
        error.username= '';
    }
    if(!user.email){
        console.log('email is empty');
        error.email= '(email is empty)';
    }else{
        error.email= '';
    }
    if(!user.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
        console.log('give us a valid email address');
        error.email= '(Please give us valid email address)';
    }else{
        error.email= '';
    }
    if(user.password.length<8){
        console.log('password is too short');
        error.password_length= '(password is too short min <= 8 )';
    }else{
        error.password_length= '';
    }

    if(user.password.search(/[0-9]/) < 0){
        console.log('password must contain 1 digit');
        error.password_digit= '(password must contain at least 1 digit [0-9])';
    }else{
        error.password_digit= '';
    }
    if(user.password.search(/[!@#$%^&*]/) < 0){
        console.log('password must contain 1 special character');
        error.password_specialChar= '(password must contain at least 1 special character [!@#$%^&*])';
    }else{
        error.password_specialChar= '';
    }

    if(user.password !== confirm_password ){
        console.log('password are not the same');
        error.password= '(password are not the same)';
        error.confirm_password= '(password are not the same)';
    }else{
        error.password= '';
        error.confirm_password= '';
    }
    if( user.username
        && user.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
        && user.password
        && user.password.length>=8
        && (user.password.search(/[0-9]/) >0
            && user.password.search(/[!@#$%^&*]/) > 0)
        && (user.password === confirm_password ))
    {
        return 'ok'
    }
}

export {
    ErrorRegisterValidation,
    RegisterValidation
}
