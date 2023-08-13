import AclController from "./controllers/acl.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new AclController()
let AuthMiddleware = new AuthService()
const HomeModule = {
    '/projects/:project/acl': {
        name: 'acl',
        //title: 'home',
        controllers: [
        ],
        sub:{
          '/': {
            name: 'acl',
            ...controller.hooks?.index,
            controllers: [
              //AuthMiddleware.isLoggedIn,
              controller.index,
            ]
          },
          '/*': {
            redirect: {
              name: 'acl'
            }
          },
          '*': {
            redirect: {
              name: 'acl'
            }
          },
        }

    },
}
export default HomeModule
