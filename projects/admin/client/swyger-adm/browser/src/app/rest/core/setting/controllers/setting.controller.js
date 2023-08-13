import BaseController from "../../../../helpers/common/controllers/base.controller.js";
import AuthModel from "../models/auth.model.js";
import {
  GeneralController,
  RoleController,
  NotificationController
} from './pages'
import {
  Sidebar,
  Navbar
} from './components'

export default class SettingController extends BaseController{
    authModel = new AuthModel()
    accessToken
    refreshToken
    constructor() {
        super();
      //this.theme='default'
      this.parentPath='/app/core/setting/'
      this.pathTheme='/index.html'
      this.parentComponentPath='setting.view.html'
      this.components=[
        Sidebar,
        Navbar
      ]
    }

  index=async(req)=>{
    let meta={
      title:"Overview | Agglomy !",
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
    }
    const data = GeneralController(this.authModel,this.client)
    data.activeTab='index'
    await this.render({data, meta,views})

  }
  general=async(req)=>{
      let meta={
        title:"General | Agglomy !",
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
       index:'pages/general.html'
     }
      const data = GeneralController(this.authModel,this.client)
      data.activeTab='general'
      await this.render({data, meta,views})

   }
  roles=async(req)=>{
    let meta={
      title:"Roles | Agglomy !",
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
      index:'pages/roles.html',
      new_role_modal:'components/modal/new-role.html'
    }
    const data = RoleController(this.authModel,this.client)
    data.activeTab='roles'
    await this.render({data, meta,views})

  }
  members=async(req)=>{
    let meta={
      title:"Members | Agglomy !",
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
      index:'pages/members.html',
      new_member_modal:'components/modal/new-member.html'

    }
    const data = GeneralController(this.authModel,this.client)
    data.activeTab='members'
    await this.render({data, meta,views})

  }
  notification=async(req)=>{
    let meta={
      title:"Notification | Agglomy !",
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
      index:'pages/notification.html',
    }
    const data = GeneralController(this.authModel,this.client)
    data.activeTab='notification'
    await this.render({data, meta,views})

  }
  log=async(req)=>{
    let meta={
      title:"Log | Agglomy !",
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
      index:'pages/log.html',
    }
    const data = GeneralController(this.authModel,this.client)
    data.activeTab='log'
    await this.render({data, meta,views})

  }





}
