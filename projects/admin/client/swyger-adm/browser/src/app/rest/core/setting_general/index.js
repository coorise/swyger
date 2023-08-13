import GeneralSettingController from "./controllers/setting_general.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new GeneralSettingController()
let AuthMiddleware = new AuthService()
const GeneralSettingModule = {
    '/setting': {
        name: 'setting',
      //title: 'home',
      controllers: [
      ],
      sub:{
        '/': {
          name: 'setting-overview',
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
          name: 'setting-general',
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
          name: 'setting-roles',
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
          name: 'setting-members',
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
          name: 'setting-notification',
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
          name: 'setting-log',
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
            name: 'setting-overview'
          }
        },
        '*': {
          redirect: {
            name: 'setting-overview'
          }
        },
      }

    },
}
export default GeneralSettingModule
