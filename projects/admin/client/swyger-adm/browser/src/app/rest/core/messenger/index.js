import MessengerController from "./controllers/messenger.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new MessengerController()
let AuthMiddleware = new AuthService()
const MessengerModule = {
    '/projects/:project/messenger': {
        name: 'messenger',
        //title: 'home',
        controllers: [
        ],
        sub:{
          '/': {
            name: 'messenger',
            ...controller.hooks?.index,
            controllers: [
              //AuthMiddleware.isLoggedIn,
              controller.index,
            ]
          },
          '/*': {
            redirect: {
              name: 'messenger'
            }
          },
          '*': {
            redirect: {
              name: 'messenger'
            }
          },
        }

    },
}
export default MessengerModule
