import BaseController from "../../../../helpers/common/controllers/base.controller.js";
import {
  ReadController
}from "./pages";

export default class CampaignController extends BaseController{

    constructor() {
      super();
      //this.theme='default'
      this.parentPath='/app/api/campaign/'
      this.pathTheme='/index.html'
      this.parentComponentPath='campaign.view.html'
    }
    index=async (req)=>{
       let meta={
         title:"Campaign | Agglomy !",
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
      const components={
        // that is a way to import your template
        // the let is the name and right side is the path
        //so on your parent template, use  eg: <index/>
        index:'pages/index.html',
        //navbar:'components/navbar.html'
      }
      const data = ReadController({client:this.client})
      await this.render({data, meta,views})
    }
}
