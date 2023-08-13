import AuthModule from "./auth/index.js";
import NotFoundModule from "./not_found/index.js";
import ProfileModule from "./profile/index.js";
import SettingModule from "./setting/index.js";
import TaskModule from "./tasks/index.js";
import StorageModule from "./storage/index.js";
import PluginModule from "./plugins/index.js";
import MonitorModule from "./monitor/index.js";
import AdminUserModule from "./admin_users/index.js";
import AnalyticModule from "./analytics/index.js";
import ApiTokenModule from "./api_token/index.js";
import CampaignModule from "./campaign/index.js";
import CronModule from "./cron/index.js";
import DatabaseModule from "./database/index.js";
import DocModule from "./doc/index.js";
import GeneralSettingModule from "./setting_general/index.js";

//Here is the core module, because some modules are dependant from other modules,
// So when you remove something here, care to check if there is no usages outside
let CoreModule={
  ...NotFoundModule,
  ...AuthModule,
  ...GeneralSettingModule,
  ...ProfileModule,
  ...SettingModule,
  ...TaskModule,
  ...StorageModule,
  ...PluginModule,
  ...MonitorModule,
  ...AdminUserModule,
  ...AnalyticModule,
  ...ApiTokenModule,
  ...CampaignModule,
  ...CronModule,
  ...DatabaseModule,
  ...DocModule,
}
export default CoreModule
