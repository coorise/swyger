import ProjectsController from "./controllers/projects.controller.js";
import AuthMiddleware from "../../../middlewares/auth.middleware.js";
import PermissionMiddleware from "../../../middlewares/permission.middleware.js";

let controller = new ProjectsController()
let authMiddleware = new AuthMiddleware()
let permissionMiddleware = new PermissionMiddleware()
const ProjectModule = {
    '/project': {
      sub:{
        '/create':{
          name: 'create-project',
          ...controller.hooks?.index,
          controllers: [
            authMiddleware.required,
            (req)=>permissionMiddleware.hasPermission({req, path:_DIR_PATH.PROJECTS, actions:['create', 'manage']}),
            controller.create,
          ]
        },
        '/*': {
          redirect: {
            name: 'create-project'
          }
        },
        '*': {
          redirect: {
            name: 'create-project'
          }
        },
      },

    },
    '/projects': {
        name: 'projects',
        //title: 'home',
        controllers: [
        ],
        sub:{
          '/': {
            name: 'projects',
            ...controller.hooks?.list,
            controllers: [
              authMiddleware.required,
              (req)=>permissionMiddleware.hasPermission({req,path:_DIR_PATH.PROJECTS, actions:['read', 'manage']}),
              controller.list,
            ]
          },
          '/:project': {
            name: 'project',
            ...controller.hooks?.index,
            controllers: [
              authMiddleware.required,
              (req)=>permissionMiddleware.hasPermission({req,path:_DIR_PATH.PROJECTS, actions:['read', 'manage']}),
              controller.index,
            ]
          },
          '/:project/detail': {
            name: 'project',
            ...controller.hooks?.detail,
            controllers: [
              authMiddleware.required,
              (req)=>permissionMiddleware.hasPermission({req,path:_DIR_PATH.PROJECTS, actions:['read', 'manage']}),
              controller.detail,
            ]
          },
          '/:project/database': {
            name: 'project-database',
            ...controller.hooks?.database,
            controllers: [
              authMiddleware.required,
              (req)=>permissionMiddleware.hasPermission({req,path:_DIR_PATH.PROJECTS,projectId:req.params?.project, actions:['read', 'manage']}),
              controller.database,
            ]
          },

          '/*': {
            redirect: {
              name: 'projects'
            }
          },
          '*': {
            redirect: {
              name: 'projects'
            }
          },
        }

    },
}
export default ProjectModule
