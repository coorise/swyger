import ApiTokenController from "./controllers/api-token.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new ApiTokenController()
let AuthMiddleware = new AuthService()
const ApiTokenModule = {
    '/projects/:project/api-tokens': {
        name: 'api-tokens',
        //title: 'home',
        controllers: [
        ],
        sub:{
          '/': {
            name: 'api-tokens',
            ...controller.hooks?.index,
            controllers: [
              //AuthMiddleware.isLoggedIn,
              controller.index,
            ]
          },
          '/*': {
            redirect: {
              name: 'api-tokens'
            }
          },
          '*': {
            redirect: {
              name: 'api-tokens'
            }
          },
        }

    },
}
export default ApiTokenModule
