import 'reflect-metadata';

import {
    createConnections,
    getConnectionManager,
} from 'typeorm';
import logger from '../../logger/winston/logger';
import {ENVIRONMENT} from "../../../helpers/typescript/enums";
import {validateDriveModule} from "./data.drive.validation";



/**
 * Typeorm default configuration
 *
 * @see https://http://typeorm.io
 */
export class typeDatabase {

  constructor () { }

  /**
   * @description Connect to MySQL server
   * @async
   */
  static connect(options: any): void {
    //console.log('file ',options)

    const connections = createConnections(options);
    connections
      .then( (con) => {
        let ENV = ""
        if ( ( process.argv && process.argv.indexOf('--env') !== -1 ) ) { // node your-script.js  --env development|production|test
          // @ts-ignore
          ENV = ENVIRONMENT[process.argv[process.argv.indexOf('--env') + 1]] as string || ENVIRONMENT.development;
        } else if ( process.env.RUNNER ) {
          ENV = ENVIRONMENT.test;
        } else if ( process.env.NODE_ENV ) {
          ENV = ENVIRONMENT[process.env.NODE_ENV as ENVIRONMENT];
        }
        console.log('--------------Database List: Begin-------------')
        options.forEach((db:any) =>{
          console.log(`--> Connected to ${db.type}: ${db.name} name established on port ${db.port} (${ENV})`)
          //logger.log('info', `Connection to ${db.type}: ${db.name} server established on port ${db.port} (${ENV})`);
        })
        console.log('--------------Database List: End---------------')

        validateDriveModule()

      })
      .catch( (error: Error) => {
        process.stdout.write(`error: ${error.message}`);
        process.exit(1);
      });

  }
}
