import HomeModule from "./home/index.js";
import ProjectModule from "./projects/index.js";
import TimelineModule from "./timeline/index.js";
import UserModule from "./users/index.js";

let ApiModule = {
  ...HomeModule,
  ...ProjectModule,
  ...TimelineModule,
  ...UserModule
}

export default ApiModule
