import PluginsController from "./controllers/plugins.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new PluginsController()
let AuthMiddleware = new AuthService()
const PluginModule = {
    '/projects/:project/plugins': {
        name: 'plugins',
        //title: 'home',
        controllers: [
        ],
        sub:{
          '/': {
            name: 'plugins',
            ...controller.hooks?.index,
            controllers: [
              //AuthMiddleware.isLoggedIn,
              controller.index,
            ]
          },
          '/*': {
            redirect: {
              name: 'plugins'
            }
          },
          '*': {
            redirect: {
              name: 'plugins'
            }
          },
        }

    },
}
export default PluginModule
