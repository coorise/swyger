import TaskController from "./controllers/webhooks.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new TaskController()
let AuthMiddleware = new AuthService()
const WebhookModule = {
    '/projects/:project/webhooks': {
        name: 'webhooks',
        //title: 'task',
        controllers: [
        ],
      sub:{
        '/': {
          name: 'webhooks',
          ...controller.hooks?.index,
          controllers: [
            //AuthMiddleware.isLoggedIn,
            controller.index,
          ]
        },
        '/*': {
          redirect: {
            name: 'webhooks'
          }
        },
        '*': {
          redirect: {
            name: 'webhooks'
          }
        },
      }

    },
}
export default WebhookModule
