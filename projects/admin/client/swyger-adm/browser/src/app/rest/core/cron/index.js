import CronController from "./controllers/cron.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new CronController()
let AuthMiddleware = new AuthService()
const CronModule = {
    '/projects/:project/cron': {
        name: 'cron',
        //title: 'home',
        controllers: [
        ],
        sub:{
          '/': {
            name: 'cron',
            ...controller.hooks?.index,
            controllers: [
              //AuthMiddleware.isLoggedIn,
              controller.index,
            ]
          },
          '/*': {
            redirect: {
              name: 'cron'
            }
          },
          '*': {
            redirect: {
              name: 'cron'
            }
          },
        }

    },
}
export default CronModule
