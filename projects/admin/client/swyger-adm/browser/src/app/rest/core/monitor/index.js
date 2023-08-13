import MonitorController from "./controllers/monitor.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new MonitorController()
let AuthMiddleware = new AuthService()
//Monitor, for watching the global project like errors, app health, cpu...etc
const MonitorModule = {
    '/projects/:project/monitor': {
        name: 'monitor',
        //title: 'home',
        controllers: [
        ],
        sub:{
          '/': {
            name: 'monitor',
            ...controller.hooks?.index,
            controllers: [
              //AuthMiddleware.isLoggedIn,
              controller.index,
            ]
          },
          '/*': {
            redirect: {
              name: 'monitor'
            }
          },
          '*': {
            redirect: {
              name: 'monitor'
            }
          },
        }

    },
}
export default MonitorModule
