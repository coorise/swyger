import TaskController from "./controllers/tasks.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new TaskController()
let AuthMiddleware = new AuthService()
const TaskModule = {
    '/projects/:project/tasks': {
        name: 'tasks',
        //title: 'task',
        controllers: [
        ],
        sub:{
          '/': {
            name: 'tasks',
            ...controller.hooks?.index,
            controllers: [
              //AuthMiddleware.isLoggedIn,
              controller.index,
            ]
          },
          '/*': {
            redirect: {
              name: 'tasks'
            }
          },
          '*': {
            redirect: {
              name: 'tasks'
            }
          },
        }

    },
}
export default TaskModule
