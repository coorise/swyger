import {
  login,
  register,
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
} from './parts'
import authService from "../services/typeorm/auth.service";

class AuthController{

  name
  service
  constructor(service,name) {
    this.name=name
    this.service=service
  }
  register=(req,res,next)=>register(this.service,this.name,req,res,next,this.name)
  login=(req,res,next)=>login(this.service,this.name,req,res,next)
  user=(req,res,next)=>user(this.service,this.name,req,res,next)
  logout=(req,res,next)=>logout(this.service,this.name,req,res,next)
  deleteAccount=(req,res,next)=>deleteAccount(this.service,this.name,req,res,next)
  refreshToken=(req,res,next)=>refreshToken(this.service,this.name,req,res,next)
  resetPassword=(req,res,next)=>resetPassword(this.service,this.name,req,res,next)
  isAuthenticated=(req,res,next)=>isAuthenticated(this.service,this.name,req,res,next)
  sendEmailVerification=(req,res,next)=>sendEmailVerification(this.service,this.name,req,res,next)
  sendForgotPassword=(req,res,next)=>sendForgotPassword(this.service,this.name,req,res,next)
  verifyEmailCode=(req,res,next)=>verifyEmailCode(this.service,this.name,req,res,next)
  verifyPassCode=(req,res,next)=>verifyPassCode(this.service,this.name,req,res,next)
  verifyTokenCode=(req,res,next)=>verifyTokenCode(this.service,this.name,req,res,next)
  sendPhoneVerification=(req,res,next)=>sendPhoneVerification(this.service,this.name,req,res,next)
  verifyPhoneCode=(req,res,next)=>verifyPhoneCode(this.service,this.name,req,res,next)
  updateAccount=(req,res,next)=>updateAccount(this.service,this.name,req,res,next)
}
export default new AuthController(authService,'auth')
























