import BaseController from "../../../../helpers/common/controllers/base.controller.js";
import {
  IndexController
}from "./pages";

export default class HomeController extends BaseController{

    constructor() {
      super();
      //this.theme='default'
      this.parentPath='/app/api/home/'
      this.pathTheme='/index.html'
      this.parentComponentPath='home.view.html'
    }
    index=async (req)=>await IndexController({req,controller:this})
}
