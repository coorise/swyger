import MailController from "./controllers/mail.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new MailController()
let AuthMiddleware = new AuthService()
const MailModule = {
    '/projects/:project/mail': {
        name: 'mail',
        //title: 'home',
        controllers: [
        ],
        sub:{
          '/': {
            name: 'mail',
            ...controller.hooks?.index,
            controllers: [
              //AuthMiddleware.isLoggedIn,
              controller.index,
            ]
          },
          '/*': {
            redirect: {
              name: 'mail'
            }
          },
          '*': {
            redirect: {
              name: 'mail'
            }
          },
        }

    },
}
export default MailModule
