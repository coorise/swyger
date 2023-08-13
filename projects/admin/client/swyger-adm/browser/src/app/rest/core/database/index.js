import DatabaseController from "./controllers/database.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new DatabaseController()
let AuthMiddleware = new AuthService()
const DatabaseModule = {
    '/projects/:project/database': {
        name: 'database',
        //title: 'home',
        controllers: [
        ],
        sub:{
          '/': {
            name: 'database',
            ...controller.hooks?.index,
            controllers: [
              //AuthMiddleware.isLoggedIn,
              controller.index,
            ]
          },
          '/*': {
            redirect: {
              name: 'database'
            }
          },
          '*': {
            redirect: {
              name: 'database'
            }
          },
        }

    },
}
export default DatabaseModule
