import ProfileController from "./controllers/profile.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new ProfileController()
let AuthMiddleware = new AuthService()
const ProfileModule = {
    '/projects/:project/profile': {
        name: 'profile',
        //title: 'home',
        controllers: [
        ],
      sub:{
        '/': {
          name: 'profile',
          ...controller.hooks?.index,
          controllers: [
            //AuthMiddleware.isLoggedIn,
            controller.index,
          ]
        },
        '/*': {
          redirect: {
            name: 'profile'
          }
        },
        '*': {
          redirect: {
            name: 'profile'
          }
        },
      }

    },
}
export default ProfileModule
