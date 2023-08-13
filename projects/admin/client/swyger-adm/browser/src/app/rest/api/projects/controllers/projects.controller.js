import BaseController from "../../../../helpers/common/controllers/base.controller.js";
import {
  CreateController,
  DetailController,
  UpdateController,
  DeleteController, ListController,ProjectController
} from "./pages";
import ProjectModel from "../models/project.model.js";

export default class ProjectsController extends BaseController{
    projectModel=new ProjectModel()
    constructor() {
      super();
      //this.theme='default'
      this.parentPath='/app/api/project/'
      this.pathTheme='/index.html'
      this.parentComponentPath='project.view.html'
    }
    index=async (req)=>await ProjectController?.IndexController({req,controller:this})
    database=async (req)=>await ProjectController?.DatabaseController({req,controller:this})
    create=async (req)=>await CreateController({req,controller:this})
    list=async (req)=>await ListController({req,controller:this})
    detail=async (req)=>await DetailController({req,controller:this})
}
