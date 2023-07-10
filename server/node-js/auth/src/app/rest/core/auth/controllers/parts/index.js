import register from "./register";
import login from "./login";
import logout from "./logout";
import deleteAccount from "./delete_account";
import refreshToken from "./refresh_token";
import resetPassword from "./reset_password";
import isAuthenticated from "./is_authenticated";
import sendEmailVerification from "./otp/email/send_email_verification";
import sendForgotPassword from "./otp/email/send_forgot_password";
import verifyEmailCode from "./otp/email/verify_email_code";
import verifyPassCode from "./otp/email/verify_pass_code";
import verifyTokenCode from "./otp/email/verify_token_code";
import sendPhoneVerification from "./otp/phone/send_phone_verification";
import verifyPhoneCode from "./otp/phone/verify_phone_code";
import updateAccount from "./update_account";
import user from "./user";

export {
    register,
    login,
    logout,
    deleteAccount,
    refreshToken,
    resetPassword,
    isAuthenticated,
    sendEmailVerification,
    sendForgotPassword,
    verifyEmailCode,
    verifyPassCode,
    verifyTokenCode,
    sendPhoneVerification,
    verifyPhoneCode,
    updateAccount,
    user
}