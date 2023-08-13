import BaseController from "../../../../helpers/common/controllers/base.controller.js";
import AuthModel from "../../auth/models/auth.model.js";
import {
  SendEmailCodeController,
  VerifyEmailCodeController,
  SetNewPasswordController,
  ForgotPasswordController,
  VerifyForgotPasswordCodeController,
  UpdatePasswordController,
  UpdateProfileController

} from './pages'
export default class ProfileController extends BaseController{
    authModel = new AuthModel()
    accessToken
    refreshToken
    constructor() {
        super();
      //this.theme='default'
      this.parentPath='/app/core/profile/'
      this.pathTheme='/index.html'
      this.parentComponentPath='profile.view.html'
    }

   index=async(req)=>{
      let meta={
        title:"Profile | Agglomy !",
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
       index:'pages/index.html',
       sidebar:'../../api/project/components/sidebar.html',
       navbar:'../../api/project/components/navbar.html',
     }
      const data = {
        tab:'update-profile', //to switch tabs or create function onclick for instance
        title:'uuuuu',
        sendMail:()=>SendEmailCodeController(this.authModel,this.client),
        verifyMail:()=>SendEmailCodeController(this.authModel,this.client),
        sendForgotPassword:()=>SendEmailCodeController(this.authModel,this.client),
        verifyForgotPassword:()=>SendEmailCodeController(this.authModel,this.client),
        setNewPassword:()=>SendEmailCodeController(this.authModel,this.client),
        updatePassword:()=>SendEmailCodeController(this.authModel,this.client),
        updateProfile:()=>SendEmailCodeController(this.authModel,this.client),
      }
      await this.render({data, meta,views})
   }
}
