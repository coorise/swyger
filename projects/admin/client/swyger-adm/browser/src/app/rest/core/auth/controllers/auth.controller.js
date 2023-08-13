import BaseController from "../../../../helpers/common/controllers/base.controller.js";
import AuthModel from "../models/auth.model.js";
import {
  LoginController,
  RegisterController,
  ForgotPasswordController,
  VerifyForgotPasswordCodeController,
  SetNewPasswordController,
  VerifyTokenCodeController,
  VerifyEmailCodeController
} from './pages'

export default class AuthController extends BaseController{
    authModel = new AuthModel()
    accessToken
    refreshToken
    constructor() {
        super();
      //this.theme='default'
      this.parentPath='/app/core/auth/'
      this.pathTheme='/index.html'
      this.parentComponentPath='auth.html'
    }

   login=async(req)=>await LoginController({req,controller:this})

   register=async(req)=> await RegisterController({req,controller:this})

   forgotPassword=async(req)=>await ForgotPasswordController({req,controller:this})

  verifyEmailCode=async(req)=>await VerifyEmailCodeController({req,controller:this})

  verifyForgotPasswordCode=async(req)=>{
      let meta={
        title:"Verify Pass Code | Agglomy !",
        meta: [
          {
            name: "child value",
            content: "child content value"
          },
        ]
        // name:"Name"
      }
      //console.log('path : ', req.path)
      //console.log('query : ', req.query)
      //console.log('param : ', req.param)
     const views={
       // that is a way to import your template
       // the let is the name and right side is the path
       //so on your parent template, use  eg: <index/>
       index:'pages/verify-forgot-password-code.html',
     }
      const data = VerifyForgotPasswordCodeController(this.authModel,this.client)
      await this.render({data, meta,views})
   }
   setNewPassword=async(req)=>{
      let meta={
        title:"New Password | Agglomy !",
        meta: [
          {
            name: "child value",
            content: "child content value"
          },
        ]
        // name:"Name"
      }
      //console.log('path : ', req.path)
      //console.log('query : ', req.query)
      //console.log('param : ', req.param)
     const views={
       // that is a way to import your template
       // the let is the name and right side is the path
       //so on your parent template, use  eg: <index/>
       index:'pages/set-new-password.html',
     }
      const data = SetNewPasswordController(this.authModel,this.client)
      await this.render({data, meta,views})
   }
  verifyTokenCode=async(req)=>await VerifyTokenCodeController({req,controller:this})


}
