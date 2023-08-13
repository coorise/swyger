

let ErrorLoginValidation = {
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
const LoginValidation =(user,error)=>{

    if(!user.email){
        console.log('email is empty');
        error.email= '(email is empty)';
    }else{
        error.email= '';
    }

    if(!user.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
        console.log('give us a valid email address');
        error.style.display='block'
        error.email= '(Please give us valid email address)';
    }else{
        error.email= '';
    }
    if(user.password.length<8){
        console.log('password is too short');
        error.style.display='block'
        error.password_length= '(password is too short min <= 8 )';
    }else{
        error.password_length= '';
    }

    if(user.password.search(/[0-9]/) < 0){
        console.log('password must contain 1 digit');
        error.style.display='block'
        error.password_digit= '(password must contain at least 1 digit [0-9])';
    }else{
        error.password_digit= '';
    }
    if(user.password.search(/[!@#$%^&*]/) < 0){
        console.log('password must contain 1 special character');
        error.style.display='block'
        error.password_specialChar= '(password must contain at least 1 special character [!@#$%^&*])';
    }else{
        error.password_specialChar= '';
    }

    if(user.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
        && user.password
        && user.password.length>=8
        && (user.password.search(/[0-9]/) >0
            && user.password.search(/[!@#$%^&*]/) > 0)
    ){
        return 'ok'
    }

}

export {
    LoginValidation,
    ErrorLoginValidation
}
