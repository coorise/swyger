import HomeController from "./controllers/home.controller.js";
import AuthMiddleware from "../../../middlewares/auth.middleware.js";

let controller = new HomeController()
let authMiddleware = new AuthMiddleware()
const HomeModule = {
    '/home': {
        name: 'home',
      //title: 'home',
      controllers: [
      ],
      sub:{
        '/': {
          name: 'home',
          ...controller.hooks?.index,
          controllers: [
            //authMiddleware.required,
            controller.index,
          ],
          data: {
            //custom: "data" // you can get data with req.data
          }
        },
        '/*': {
          redirect: {
            name: 'home'
          }
        },
        '*': {
          redirect: {
            name: 'home'
          }
        },
      }

    },
}
export default HomeModule
