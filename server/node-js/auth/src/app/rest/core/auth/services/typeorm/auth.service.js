import register from "./parts/register";
import login from "./parts/login";
import logout from "./parts/logout";
import sendForgotPassword from "./parts/otp/email/send-forgot-password";
import resetPassword from "./parts/reset-password";
import refreshToken from "./parts/refresh_token";
import verifyPassCode from "./parts/otp/email/verify-pass-code";
import verifyEmailCode from "./parts/otp/email/verify-email-code";
import verifyTokenCode from "./parts/otp/email/verify-token-code";
import verifyPhoneCode from "./parts/otp/phone/verify-phone-code";
import sendEmailVerification from "./parts/otp/email/send-email-verification";
import sendPhoneVerification from "./parts/otp/phone/send-phone-verification";
import deleteAccount from "./parts/delete-account";
import updateAccount from "./parts/update_account";
import isAuthenticated from "./parts/is_authenticated";
import user from "./parts/user";



export default {
  register,
  login,
  logout,
  sendForgotPassword,
  resetPassword,
  verifyPassCode,
  refreshToken,
  verifyEmailCode,
  verifyTokenCode,
  verifyPhoneCode,
  sendEmailVerification,
  sendPhoneVerification,
  deleteAccount,
  updateAccount,
  isAuthenticated,
  user
};
