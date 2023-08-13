import BaseController from "../../../../helpers/common/controllers/base.controller.js";
import {
  CreateController,
  ReadController,
  UpdateController,
  DeleteController
}from "./pages/index.js";

export default class TaskController extends BaseController{

    constructor() {
      super();
      //this.theme='default'
      this.parentPath='/app/api/tasks/'
      this.pathTheme='/index.html'
      this.parentComponentPath='tasks.view.html'
    }
    index=async (req)=>{
       let meta={
         title:"Tasks | Agglomy !",
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
        //navbar:'components/navbar.html'
      }
      const data = ReadController({client:this.client})
      await this.render({data, meta,views})
    }
}
