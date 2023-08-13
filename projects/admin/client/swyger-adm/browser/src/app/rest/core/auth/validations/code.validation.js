

let ErrorCodeValidation = {
    style:{
        color:'red',
        display:'none',
    },
    email:'',
    code:'',
    code_length:'',
}
const CodeValidation =(user,error)=>{

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
    if(user.code.length<0){
        console.log('password is too short');
        error.style.display='block'
        error.code_length= '(code is too short)';
    }else{
        error.code_length= '';
    }

    if(user.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
        && user.code
        && user.code.length>0
    ){
        return 'ok'
    }

}

export {
    CodeValidation,
    ErrorCodeValidation
}
