import NotFoundController from "./controllers/not-found.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new NotFoundController()
let AuthMiddleware = new AuthService()
const NotFoundModule = {
    '/not-found': {
        name: 'not-found',
        //title: 'home',
        controllers: [

        ],
        sub:{
          '/': {
            name: 'not-found',
            ...controller.hooks?.index,
            controllers: [
              //AuthMiddleware.isLoggedIn,
              controller.index,
            ]
          },
          '/*': {
            redirect: {
              name: 'not-found'
            }
          },
          '*': {
            redirect: {
              name: 'not-found'
            }
          },
        }

    },
}
export default NotFoundModule
