import CoreModule from "./core/index.js";
import ApiModule from "./api/index.js";


let IndexModule={
  ...CoreModule,
  //put api modules at the end of the core
  ...ApiModule
}

export default IndexModule
