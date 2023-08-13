import CampaignController from "./controllers/campaign.controller.js";
import AuthService from "../../../middlewares/auth.middleware.js";

let controller = new CampaignController()
let AuthMiddleware = new AuthService()
const CampaignModule = {
    '/projects/:project/campaign': {
        name: 'campaign',
        //title: 'home',
        controllers: [
        ],
        sub:{
          '/': {
            name: 'campaign',
            ...controller.hooks?.index,
            controllers: [
              //AuthMiddleware.isLoggedIn,
              controller.index,
            ]
          },
          '/*': {
            redirect: {
              name: 'campaign'
            }
          },
          '*': {
            redirect: {
              name: 'campaign'
            }
          },
        }

    },
}
export default CampaignModule
