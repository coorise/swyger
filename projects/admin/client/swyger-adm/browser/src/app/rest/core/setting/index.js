import SettingController from "./controllers/setting.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new SettingController()
let AuthMiddleware = new AuthService()
const SettingModule =  {
        '/projects/:project/setting': {
            name: 'project-setting',
            //title: 'router.js',
            controllers: [//parentView+='/auth',
                function(req) {

                },
            ],
            sub:{
            '/': {
              name: 'project-overview',
              ...controller.hooks?.index,
              controllers: [
                //AuthMiddleware.isLoggedIn,
                controller.index,
              ],
              data: {
                //custom: "data" // you can get data with req.data
              }
            },
            '/general': {
              name: 'project-general',
              ...controller.hooks?.general,
              controllers: [
                //AuthMiddleware.isLoggedIn,
                controller.general,
              ],
              data: {
                //custom: "data" // you can get data with req.data
              }
            },
            '/roles': {
              name: 'project-roles',
              ...controller.hooks?.roles,
              controllers: [
                //AuthMiddleware.isLoggedIn,
                controller.roles,
              ],
              data: {
                //custom: "data" // you can get data with req.data
              }
            },
            '/members': {
              name: 'project-members',
              ...controller.hooks?.members,
              controllers: [
                //AuthMiddleware.isLoggedIn,
                controller.members,
              ],
              data: {
                //custom: "data" // you can get data with req.data
              }
            },
            '/notification': {
              name: 'project-notification',
              ...controller.hooks?.notification,
              controllers: [
                //AuthMiddleware.isLoggedIn,
                controller.notification,
              ],
              data: {
                //custom: "data" // you can get data with req.data
              }
            },
            '/log': {
              name: 'project-log',
              ...controller.hooks?.log,
              controllers: [
                //AuthMiddleware.isLoggedIn,
                controller.log,
              ],
              data: {
                //custom: "data" // you can get data with req.data
              }
            },
            '/overview': {
              redirect: {
                name: 'project-overview'
              }
            },
            '*': {
              redirect: {
                name: 'project-overview'
              }
            },
          }
        },
        'projects/:project/setting-general': {
            redirect: {
                name: 'project-general'
            }
        },
        'projects/:project/setting-preference': {
            redirect: {
                name: 'project-preference'
            }
        },
        'projects/:project/setting-notification': {
          redirect: {
            name: 'project-notification'
          }
        },
}
export default SettingModule
