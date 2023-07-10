import {
    forgotPassword,
    login,
    register,
    logout,
    resetPassword,
    verifyPassCode,
    verifyEmailCode,
    sendEmailVerification,
    deleteAccount

} from './schemas'
import DocModelRoute from "../../../../../helpers/common/doc/swagger/model.doc";


class AuthSwagger extends DocModelRoute{}
const authSwagger = new AuthSwagger('/auth')

//------------You can modify the custom doc schema----------------//

authSwagger.setData.custom=[
    //--------------Begin Login-----------------//
    {
        childPath:'/login',
        description:'Login a User',
        method:'post',
        parameter:{
            description:'User object  {email,password}',
            schema:login,
        },
    },
    //------------End Login----------------//
    //--------------------------------------------------------//
    //--------------Begin Register------------------//
    {
        childPath:'/register',
        description:'',
        method:'post',
        parameter:{
            description:'',
            schema:register,
        },
    },
    //------------End Register----------------//
    //--------------------------------------------------------//
    //--------------Begin Logout------------------//
    {
        childPath:'/logout',
        description:'',
        method:'post',
        parameter:{
            description:'',
            schema:logout,
        },
    },
    //------------End Logout----------------//
    //--------------------------------------------------------//
    //--------------Begin Reset Password------------------//
    {
        childPath:'/reset-password',
        description:'',
        method:'post',
        parameter:{
            description:'',
            schema:resetPassword,
        },
    },
    //------------End Reset Password----------------//
    //--------------------------------------------------------//
    //--------------Begin Forgot Password------------------//
    {
        childPath:'/forgot-password',
        description:'',
        method:'post',
        parameter:{
            description:'',
            schema:forgotPassword,
        },
    },
    //------------End Forgot Password----------------//

    //--------------------------------------------------------//

    //--------------Begin Verify Code------------------//
    {
        childPath:'/verify-pass-code',
        description:'',
        method:'post',
        parameter:{
            description:'',
            schema:verifyPassCode,
        },
    },
    //------------End Verify Code----------------//
    //--------------------------------------------------------//

    //--------------Begin Verify Code------------------//
    {
        childPath:'/is-authenticated',
        description:'',
        method:'post',
        parameter:{
            description:'',
            schema:verifyEmailCode,
        },
    },
    //------------End Verify Code----------------//

    //--------------------------------------------------------//

    //--------------Begin Verify Code------------------//
    {
        childPath:'/send-email-verification',
        description:'',
        method:'post',
        parameter:{
            description:'',
            schema:sendEmailVerification,
        },
    },
    //------------End Verify Code----------------//

    //--------------------------------------------------------//

    //--------------Begin Check Email------------------//
    {
        childPath:'/delete-account',
        description:'',
        method:'post',
        parameter:{
            description:'',
            schema:deleteAccount,
        },
    },
    //------------End Check Email---------------//
    //--------------------------------------------------------//

    //--------------Begin Check Email------------------//
    {
        childPath:'/update-account',
        description:'',
        method:'post',
        parameter:{
            description:'',
            schema:register,
        },
    },
    //------------End Check Email---------------//
    //--------------------------------------------------------//
]
//------------You can modify custom doc----------------//s





export default authSwagger.getCustomDefaultRoutes() //return the sub-path and template