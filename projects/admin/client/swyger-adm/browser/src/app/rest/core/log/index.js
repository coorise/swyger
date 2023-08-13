import LogController from "./controllers/log.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new LogController()
let AuthMiddleware = new AuthService()
const HomeModule = {
    '/projects/:project/log': {
        name: 'log',
        //title: 'home',
        controllers: [
        ],
        sub:{
          '/': {
            name: 'log',
            ...controller.hooks?.index,
            controllers: [
              //AuthMiddleware.isLoggedIn,
              controller.index,
            ]
          },
          '/*': {
            redirect: {
              name: 'log'
            }
          },
          '*': {
            redirect: {
              name: 'log'
            }
          },
        }

    },
}
export default HomeModule
