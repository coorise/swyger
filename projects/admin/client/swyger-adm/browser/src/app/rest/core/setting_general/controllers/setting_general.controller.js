import BaseController from "../../../../helpers/common/controllers/base.controller.js";
import {
  FetchListController
}from "./pages";

export default class GeneralSettingController extends BaseController{

    constructor() {
      super();
      //In case your want to use acebase database service , you should set it
      // at the first of your constructor
      /*(async ()=>{
        this.client=await this.aceClient()
      })()*/
      //this.theme='default'
      this.parentPath='/app/core/setting_general/'
      this.pathTheme='/index.html'
      this.parentComponentPath='setting-general.view.html'
    }
    index=async (req)=>{
       let meta={
         title:"Setting | Agglomy !",
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
        modal_notification:'../../api/home/components/modal/notifications.html'
      }
      const data = FetchListController()
      data.activeTab='index'
      await this.render({data, meta,views})
    }
    general=async (req)=>{
      let meta={
        title:"General Setting | Agglomy !",
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
        index:'pages/general.html',
        modal_notification:'../../api/home/components/modal/notifications.html'
      }
      const data = FetchListController()
      data.activeTab='general'
      await this.render({data, meta,views})
    }
    roles=async (req)=>{
      let meta={
        title:"Roles Setting | Agglomy !",
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
        modal_notification:'../../api/home/components/modal/notifications.html',
        new_role_modal:'components/modal/new-role.html'
      }
      const data = FetchListController()
      data.activeTab='roles'
      data.priority=2
      await this.render({data, meta,views})
    }
    members=async (req)=>{
      let meta={
        title:"Members Setting | Agglomy !",
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
        modal_notification:'../../api/home/components/modal/notifications.html',
        new_member_modal:'components/modal/new-member.html'
      }
      const data = FetchListController()
      data.activeTab='members'
      await this.render({data, meta,views})
    }

    notification=async (req)=>{
      let meta={
        title:"Notification Setting | Agglomy !",
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
        modal_notification:'../../api/home/components/modal/notifications.html'
        //navbar:'components/navbar.html'
      }
      const data = FetchListController()
      data.activeTab='notification'
      await this.render({data, meta,views})
    }
    log=async (req)=>{
      let meta={
        title:"Log Setting | Agglomy !",
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
        modal_notification:'../../api/home/components/modal/notifications.html'
      }
      const data = FetchListController()
      data.activeTab='log'
      await this.render({data, meta,views})
    }
}
