import NotificationController from "./controllers/notifications.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new NotificationController()
let AuthMiddleware = new AuthService()
const HomeModule = {
    '/notifications': {
        name: 'notifications',
        //title: 'home',
        controllers: [
        ],
        sub:{
          '/': {
            name: 'notifications',
            ...controller.hooks?.index,
            controllers: [
              //AuthMiddleware.isLoggedIn,
              controller.index,
            ]
          },
          '/*': {
            redirect: {
              name: 'notifications'
            }
          },
          '*': {
            redirect: {
              name: 'notifications'
            }
          },
        }

    },
}
export default HomeModule
