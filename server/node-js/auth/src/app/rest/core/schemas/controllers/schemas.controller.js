import {TypeController} from '../../../../helpers/common/controller/typeorm';
import userService from '../services/typeorm/schemas.service';
import {execSync} from "child_process";


class UserController extends TypeController {
  name
  constructor(service, name) {
    super(service, name);
    this.name=name
  }
  restart=(req,res,next)=>{
    try {
      let ENV
      if ((process.argv && process.argv.indexOf('--env') !== -1)) { // node your-script.js  --env development|production|test
        // @ts-ignore
        ENV = process.argv[process.argv.indexOf('--env') + 1].toString()
        if(ENV === "development"){
          execSync('npm run dev')
        }
      }

      res.send({
        data:{
          data:{
            message:'server is restarting'
          }
        }
      })
    }catch (e) {
      console.log('Error '+this.name+'/restart :', e)
      next(new Error('Error '+this.name+'/restart, check your api request'));
    }

    //res.send('The server is restarting')
  }

}

export default new UserController(userService, 'schemas');
