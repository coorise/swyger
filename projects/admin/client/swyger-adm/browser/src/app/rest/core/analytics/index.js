import AnalyticsController from "./controllers/analytics.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new AnalyticsController()
let AuthMiddleware = new AuthService()
const AnalyticModule = {
    '/projects/:project/analytics': {
        name: 'analytics',
        //title: 'home',
        controllers: [
        ],
        sub:{
          '/': {
            name: 'analytics',
            ...controller.hooks?.index,
            controllers: [
              //AuthMiddleware.isLoggedIn,
              controller.index,
            ]
          },
          '/*': {
            redirect: {
              name: 'analytics'
            }
          },
          '*': {
            redirect: {
              name: 'analytics'
            }
          },
        }

    },
}
export default AnalyticModule
