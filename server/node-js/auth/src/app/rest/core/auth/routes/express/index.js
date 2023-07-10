import ModelRoute from "@common/route/express";
import authController from '../../controllers/auth.controller';
import authValidation from '../../validations/typeorm/auth.validation';
import ExtrasMiddleware from "../../../../../middlewares/extras";

class AuthRoute extends ModelRoute{}
const authRoute = new AuthRoute('',authController)
const extrasMiddleware=new ExtrasMiddleware()

//------------You can modify the custom default route----------------//
authRoute.setHandler.custom=[
    //--------------Begin Login------------------//
    {
        childPath:'/login*',
        method:'post',
        handlers: [authValidation.createOne],
        defaultAuth:false,
        controller:authController.login
    },
    //------------End Login----------------//

    //--------------------------------------------------------//

    //--------------Begin Register------------------//
    {
        childPath:'/register*',
        method:'post',
        handlers: [authValidation.createOne],
        defaultAuth:false,
        controller:authController.register
    },
    //------------End Register----------------//

    //--------------------------------------------------------//

    //--------------Begin Logout------------------//
    {
        childPath:'/logout*',
        method:'post',
        handlers:[...authRoute.requireAuth],
        controller:authController.logout
    },
    //------------End Logout----------------//

    //--------------------------------------------------------//

    //--------------Begin DeleteAccount------------------//
    {
        childPath:'/delete-account*',
        method:'post',
        handlers:[...authRoute.requireAuth],
        controller:authController.deleteAccount
    },
    //------------End DeleteAccount----------------//

    //--------------------------------------------------------//

    //--------------Begin DeleteAccount------------------//
    {
        childPath:'/update-account*',
        method:'post',
        handlers:[...authRoute.requireAuth],
        controller:authController.updateAccount
    },
    //------------End DeleteAccount----------------//

    //--------------------------------------------------------//

    //--------------Begin ForgotPassword------------------//
    {
        childPath:'/send-forgot-password*',
        method:'post',
        defaultAuth:false,
        controller:authController.sendForgotPassword
    },
    //------------End ForgotPassword----------------//

    //--------------------------------------------------------//

    //--------------Begin SendEmailVerification------------------//
    {
        childPath:'/send-email-verification*',
        method:'post',
        defaultAuth:false,
        controller:authController.sendEmailVerification
    },
    //------------End SendEmailVerification----------------//

    //--------------------------------------------------------//

    //--------------Begin SendEmailVerification------------------//
    {
        childPath:'/send-phone-verification*',
        method:'post',
        defaultAuth:false,
        controller:authController.sendPhoneVerification
    },
    //------------End SendEmailVerification----------------//

    //--------------------------------------------------------//

    //--------------Begin VerifyPasscode------------------//
    {
        childPath:'/verify-pass-code*',
        method:'post',
        defaultAuth:false,
        controller:authController.verifyPassCode
    },
    //------------End VerifyPassCode----------------//

    //--------------------------------------------------------//

    //--------------Begin VerifyEmailCode------------------//
    {
        childPath:'/verify-email-code*',
        method:'post',
        //defaultAuth:false,
        controller:authController.verifyEmailCode
    },
    //------------End VerifyEmailCode----------------//

    //--------------------------------------------------------//

    //--------------Begin VerifyTokenCode------------------//
    {
        childPath:'/verify-token-code*',
        method:'post',
        defaultAuth:false,
        controller:authController.verifyTokenCode
    },
    //------------End VerifyTokenCode----------------//

    //--------------------------------------------------------//

    //--------------Begin VerifyTokenCode------------------//
    {
        childPath:'/verify-phone-code*',
        method:'post',
        defaultAuth:false,
        controller:authController.verifyPhoneCode
    },
    //------------End VerifyTokenCode----------------//

    //--------------------------------------------------------//

    //--------------Begin ResetPassword------------------//
    {
        childPath:'/reset-password*',
        method:'post',
        defaultAuth:false,
        controller:authController.resetPassword
    },
    //------------End ResetPassword----------------//

    //--------------------------------------------------------//

    //--------------Begin RefreshToken------------------//
    {
        childPath:'/refresh-token*',
        method:'post',
        defaultAuth:false,
        controller:authController.refreshToken
    },
    //------------End RefreshToken----------------//

    //--------------------------------------------------------//

    //--------------Begin IsAuthenticated------------------//
    {
        childPath:'/is-authenticated*',
        handlers:[...authRoute.requireAuth],
        method:'post',
        controller:authController.isAuthenticated
    },
    //------------End IsAuthenticated----------------//

    //--------------------------------------------------------//

    //--------------Begin User------------------//
    {
        childPath:'/user*',
        method:'post',
        handlers:[...authRoute.requireAuth],
        controller:authController.user
    },
    //------------End User----------------//
    //--------------Begin User------------------//
    {
        childPath:'/acebase*',
        method:'post',
        handlers:[...authRoute.requireAuth,extrasMiddleware.required],
        controller:authController.user
    },
    //------------End User----------------//

    //--------------------------------------------------------//
]
//------------You can modify the custom default route----------------//

const route=authRoute.getCustomDefaultRoute()
export default {
    router:[
        '/auth', //your parent route to be used on route.use('parent',handler)
        route.router //return your handlers with sub-route
    ],
    socketRouter:{
        path:'/auth', //your parent route to be used on route.use('parent',handler)
        handlers:route.socketRouter //return your handlers with sub-route
    }
}
