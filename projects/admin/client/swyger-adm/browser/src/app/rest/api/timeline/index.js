import TimelineController from "./controllers/timeline.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new TimelineController()
let AuthMiddleware = new AuthService()
const TimelineModule = {
    '/timeline': {
        name: 'timeline',
        //title: 'home',
        controllers: [

        ],
        sub:{
        '/': {
          name: 'timeline',
          ...controller.hooks?.index,
          controllers: [
            //AuthMiddleware.isLoggedIn,
            controller.index,
          ]
        },
        '/*': {
          redirect: {
            name: 'timeline'
          }
        },
        '*': {
          redirect: {
            name: 'timeline'
          }
        },
      }

    },
}
export default TimelineModule
