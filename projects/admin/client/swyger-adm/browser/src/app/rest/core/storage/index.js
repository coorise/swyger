import StorageController from "./controllers/storage.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new StorageController()
let AuthMiddleware = new AuthService()
const StorageModule = {
    '/projects/:project/storage': {
        name: 'storage',
        //title: 'storage',
        controllers: [
        ],
        sub:{
          '/': {
            name: 'storage',
            ...controller.hooks?.index,
            controllers: [
              //AuthMiddleware.isLoggedIn,
              controller.index,
            ]
          },
          '/*': {
            redirect: {
              name: 'storage'
            }
          },
          '*': {
            redirect: {
              name: 'storage'
            }
          },
        }

    },
}
export default StorageModule
