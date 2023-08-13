import FunctionController from "./controllers/functions.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new FunctionController()
let AuthMiddleware = new AuthService()
const FunctionModule = {
    '/projects/:project/functions': {
        name: 'functions',
        //title: 'home',
        controllers: [

        ],
        sub:{
          '/': {
            name: 'functions',
            ...controller.hooks?.index,
            controllers: [
              //AuthMiddleware.isLoggedIn,
              controller.index,
            ]
          },
          '/*': {
            redirect: {
              name: 'functions'
            }
          },
          '*': {
            redirect: {
              name: 'functions'
            }
          },
        }

    },
}
export default FunctionModule
