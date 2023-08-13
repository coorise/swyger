import DocController from "./controllers/doc.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new DocController()
let AuthMiddleware = new AuthService()
const DocModule = {
    '/doc': {
        name: 'doc',
        //title: 'home',
        controllers: [
        ],
        sub:{
          '/': {
            name: 'doc',
            ...controller.hooks?.index,
            controllers: [
              //AuthMiddleware.isLoggedIn,
              controller.index,
            ]
          },
          '/*': {
            redirect: {
              name: 'doc'
            }
          },
          '*': {
            redirect: {
              name: 'doc'
            }
          },
        }

    },
}
export default DocModule
