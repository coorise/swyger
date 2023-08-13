import UsersController from "./controllers/users.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new UsersController()
let AuthMiddleware = new AuthService()
const UserModule = {
    '/users': {
        name: 'users',
        //title: 'home',
        controllers: [
        ],
        sub:{
          '/': {
            name: 'users',
            ...controller.hooks?.index,
            controllers: [
              //AuthMiddleware.isLoggedIn,
              controller.index,
            ]
          },
          '/*': {
            redirect: {
              name: 'users'
            }
          },
          '*': {
            redirect: {
              name: 'users'
            }
          },
        }

    },
}
export default UserModule
