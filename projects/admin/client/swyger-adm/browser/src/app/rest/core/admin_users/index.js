import AdminUserController from "./controllers/admin-users.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new AdminUserController()
let AuthMiddleware = new AuthService()
const AdminUserModule = {
    '/projects/:project/admin-users': {
        name: 'admin-users',
        //title: 'home',
        controllers: [

        ],
        sub:{
          '/': {
            name: 'admin-users',
            ...controller.hooks?.index,
            controllers: [
              //AuthMiddleware.isLoggedIn,
              controller.index,
            ]
          },
          '/*': {
            redirect: {
              name: 'admin-users'
            }
          },
          '*': {
            redirect: {
              name: 'admin-users'
            }
          },
        }

    },
}
export default AdminUserModule
