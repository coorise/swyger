import AuthController from "./controllers/auth.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new AuthController()
let AuthMiddleware = new AuthService()
const AuthModule =  {
        '/auth': {
            name: 'auth',
            //title: 'router.js',
            controllers: [
                function(req) {

                },
            ],
            sub:{
                '/register': {
                    name: 'register',
                  ...controller.hooks?.register,
                    controllers: [
                        AuthMiddleware.isLoggedIn,
                        controller.register,
                    ]
                },
                '/login': {
                    name: 'login',
                  ...controller.hooks?.login,
                    controllers: [
                        AuthMiddleware.isLoggedIn,
                        controller.login,
                    ]
                },
                '/forgot-password': {
                  name: 'forgot-password',
                  ...controller.hooks?.forgot_password,
                  controllers: [
                    //AuthMiddleware.isLoggedIn,
                    controller.forgotPassword,
                  ]
                },
                '/verify-email-code': {
                  name: 'verify-email-code',
                  ...controller.hooks?.verify_email_code,
                  controllers: [
                    //AuthMiddleware.isLoggedIn,
                    controller.verifyEmailCode,
                  ]
                },
                '/verify-pass-code': {
                  name: 'verify-pass-code',
                  ...controller.hooks?.verify_pass_code,
                  controllers: [
                    //AuthMiddleware.isLoggedIn,
                    controller.verifyForgotPasswordCode,
                  ]
                },
                '/verify-token-code': {
                  name: 'verify-token-code',
                  ...controller.hooks?.verify_token_code,
                  controllers: [
                    //AuthMiddleware.isLoggedIn,
                    controller.verifyTokenCode,
                  ]
                },
                '/new-pass-code': {
                  name: 'new-pass-code',
                  ...controller.hooks?.new_pass_code,
                  controllers: [
                    //AuthMiddleware.isLoggedIn,
                    controller.setNewPassword,
                  ]
                },
                '/': {
                    redirect: {
                        name: 'login'
                    }
                },
                '*': {
                    redirect: {
                        name: 'login'
                    }
                },
            }
        },
        'login': {
            redirect: {
                name: 'login'
            }
        },
        'register': {
            redirect: {
                name: 'register'
            }
        },
        'forgot-password': {
          redirect: {
            name: 'forgot-password'
          }
        },
}
export default AuthModule
