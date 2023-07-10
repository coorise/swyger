const ALL_AUTH_CODE={
    500:{
        //Error from server
        code:500,
        message:'Error From Server'
    },
    600:{
        //User does not exist
        code:600,
        message:'This User Does Not Exist'
    },
    601:{
        //Verify your password
        code:601,
        message:'Verify Your Password'
    },
    602:{
        // Email Already exists
        code:602,
        message:'This Email Already Exists'
    },
    603:{
        // Your Refresh Token Is Expired
        code:603,
        message:'Your Refresh Token Is Expired'
    },
    604:{
        // Verify Your Field (Email,Password)!
        code:604,
        message:'Verify Your Field (Email,Password)!'
    },
    605:{
        // Code is not valid!
        code:605,
        message:'Code Is Not Valid!'
    },
    606:{
        // Code is expired!
        code:606,
        message:'Code Is Not Expired!'
    },
    607:{
        // Code is not still verified!
        code:607,
        message:'Code Is Not Still Verified!'
    }
}
export default ALL_AUTH_CODE