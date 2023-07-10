import 'module-alias/register';


import { DatabaseEngine, EnvTypeorm } from '../../../helpers/typescript/types';
import { DATABASE_ENGINE, ENVIRONMENT } from '../../../helpers/typescript/enums';



import dbL from '../../../config/database/typeorm/typeorm.db-list'

import { list } from '../../../helpers/utils/enum.util';

// Memory cache activated
let  MEMORY_CACHE = 0

//Memory cache lifetime duration in milliseconds
let MEMORY_CACHE_DURATION = 5000
/**
 *
 * @dependency dotenv
 *
 * @see https://www.npmjs.com/package/dotenv
 *
 */
export class Environment {

  /**
   * @description Environment instance
   */
  private static instance: Environment;

  /**
   * @description Current root dir
   */
  base = 'dist';

  /**
   * @description Cluster with aggregated data
   */
  cluster = [];

  /**
   * @description Current environment
   */
  environment: string = ENVIRONMENT.development;

  /**
   * @description Errors staged on current environment
   */
  errors: string[] = [];

  /**
   * @description Env variables
   */
    // @ts-ignore
  variables: Record<string,unknown>;

  /**
   * @description DB variables
   */
  listDB: any = dbL;

  private constructor() {}

  /**
   * @description Environment singleton getter
   */
  static get(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }
    return Environment.instance;
  }

  /**
   * @description Env variables exhaustive key list
   */
  get keys(): string[] {
    return [
      'TYPEORM_DB',
      'TYPEORM_CACHE',
      'TYPEORM_CACHE_DURATION',
      'TYPEORM_HOST',
      'TYPEORM_LOG',
      'TYPEORM_NAME',
      'TYPEORM_PORT',
      'TYPEORM_PWD',
      'TYPEORM_SYNC',
      'TYPEORM_TYPE',
      'TYPEORM_USER'
    ]
  }

  /**
   * @description Embeded validation rules for env variables
   */
  get rules(): Record<string,any> {

    return {

      /**
       * @description
       *
       * @default null
       */
      TYPEORM_DB: (value: string): string => {
        if(!value) {
          this.errors.push('TYPEORM_DB not found: please define the targeted database.');
        }
        if (value && /^[0-9a-zA-Z_]{3,}$/.test(value) === false) {
          this.errors.push('TYPEORM_DB bad value: please check the name of your database according [0-9a-zA-Z_].');
        }
        // @ts-ignore
        return value || null
      },

      /**
       * @description
       *
       * @default false
       */
      TYPEORM_CACHE: (value: string): boolean => {
        if(value && isNaN(parseInt(value, 10))) {
          this.errors.push('TYPEORM_CACHE bad value: please use 0 or 1 to define activation of the db cache');
        }
        return !!parseInt(value, 10) || false
      },

      /**
       * @description
       *
       * @default 5000
       */
      TYPEORM_CACHE_DURATION: (value: string): number => {
        if(value && isNaN(parseInt(value,10))) {
          this.errors.push('TYPEORM_CACHE_DURATION bad value: please fill it with a duration expressed in ms.');
        }
        return parseInt(value,10) || 5000
      },

      /**
       * @description
       *
       * @default localhost
       */
      TYPEORM_HOST: (value: string): string => {
        if(!value) {
          this.errors.push('TYPEORM_HOST not found: please define the database server host.');
        }
        if(value && value !== 'localhost' && /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/.test(value) === false) {
          this.errors.push('TYPEORM_HOST bad value: please fill it with a valid database server host.');
        }
        return value || 'localhost'
      },

      /**
       * @description
       *
       * @default false
       */
      TYPEORM_LOG: (value: string): boolean => {
        return !!parseInt(value, 10) || false
      },

      /**
       * @description
       *
       * @default default
       */
      TYPEORM_NAME: (value: string): string => {
        return value || 'default'
      },

      /**
       * @description
       *
       * @default 3306
       */
      TYPEORM_PORT: (value: string): number => {
        if(!value) {
          this.errors.push('TYPEORM_PORT not found: please define the database server port.');
        }
        return parseInt(value,10) || 3306;
      },

      /**
       * @description
       *
       * @default null
       */
      TYPEORM_PWD: (value: string): string => {
        if(!value && ![ENVIRONMENT.test, ENVIRONMENT.development].includes(this.environment as ENVIRONMENT)) {
          this.errors.push('TYPEORM_PWD not found: please define the database user password.');
        }
        // @ts-ignore
        return value || null
      },

      /**
       * @description
       *
       * @default false
       */
      TYPEORM_SYNC: (value: boolean): boolean => {
        return this.environment === ENVIRONMENT.production ? false : this.environment === ENVIRONMENT.test ? true : !!value || false
      },

      /**
       * @description
       *
       * @default mysql
       */
      TYPEORM_TYPE: (value: string): DatabaseEngine => {
        if(!value) {
          this.errors.push('TYPEORM_TYPE not found: please define the database engine type.');
        }
        // @ts-ignore
        if(value && !DATABASE_ENGINE[value]) {
          this.errors.push(`TYPEORM_TYPE bad value: database engine must be one of following: ${list(DATABASE_ENGINE).join(',')}.`);
        }
        return (value || 'mysql') as DatabaseEngine
      },

      /**
       * @description
       *
       * @default null
       */
      TYPEORM_USER: (value: string): string => {
        if(!value) {
          this.errors.push('TYPEORM_USER not found: please define one user for your database.');
        }
        // @ts-ignore
        return value || null
      },


    }
  }

  /**
   * @description Set env according to args, and load .env file
   */
  loads(nodeVersion: string): Environment {

    const [major, minor] = nodeVersion.split('.').map( parseFloat )

    if(major < 14  || major === 14 && minor < 16) {
      this.exit('The node version of the server is too low. Please consider at least v14.16.0.');
    }

    if ( ( process.argv && process.argv.indexOf('--env') !== -1 ) ) { // node your-script.js  --env development|production|test
      let ENV = process.argv[process.argv.indexOf('--env') + 1].toString()
      if(ENV === "development"){
        this.base = "src"
      } else if(ENV === "production"){
        this.base = "dist"
      }
      // @ts-ignore
      this.environment = ENVIRONMENT[process.argv[process.argv.indexOf('--env') + 1]] as string || ENVIRONMENT.development;
    } else if ( process.env.RUNNER ) {
      this.environment = ENVIRONMENT.test;
    } else if ( process.env.NODE_ENV ) {
      this.environment = ENVIRONMENT[process.env.NODE_ENV as ENVIRONMENT];
    }

    /*const path = `${process.cwd()}/${this.base}/env/${this.environment}.env`;

    if (!existsSync(path)) {
      this.exit(`Environment file not found at ${path}`);
    }*/

    //Dotenv({path});

    return this;
  }

  /**
   * @description Extract variables from process.env
   *
   *
   */
  extracts(): Environment {
    // @ts-ignore
    this.listDB.forEach(db => {
      // console.log('Test DBBBBBBBBBBBBBBBBB')
      /*for( const [key, value] of Object.entries(db)){
        this.extracts(db)
      }*/

      this.variables = this.keys.reduce( (acc, current) => {
        if(db[current]){
          // console.log(`key: ${current}= value: ${db[current]} `)
          // @ts-ignore
          acc[current] = db[current];
        } else {
          this.errors.push(`TYPEORM not found: ${current}. Please define the targeted key`);
        }
        return acc;
      }, {});
    })

    return this;
  }

  /**
   * @description Parse allowed env variables, validate it and returns safe current or default value
   */
  validates(): Environment {

    this.keys.forEach( (key: string) => {
      this.variables[key] = this.rules[key](this.variables[key])
    });

    return this
  }

  /**
   * @description Aggregates some data for easy use
   */
  aggregates(): Environment {

    // @ts-ignore
    const listData = []
    // @ts-ignore
    this.listDB.forEach(db => {
      if(db['TYPEORM_TYPE'] !== 'mongodb') {
        listData.push({
          database: db['TYPEORM_DB'],
          name: db['TYPEORM_NAME'],
          type: db['TYPEORM_TYPE'],
          host: db['TYPEORM_HOST'],
          port: db['TYPEORM_PORT'],
          password: db['TYPEORM_PWD'],
          username: db['TYPEORM_USER'],
          synchronize: db['TYPEORM_SYNC'],
          logging: db['TYPEORM_LOG'],
          cache: !MEMORY_CACHE && db['TYPEORM_CACHE'],
          cache_duration: !MEMORY_CACHE && db['TYPEORM_CACHE'] ? db['TYPEORM_CACHE_DURATION'] : 0,
          entities: (db['TYPEORM_ENTITIES']) ? db['TYPEORM_ENTITIES'] : [],
          migrations: (db['TYPEORM_MIGRATIONS']) ? db['TYPEORM_MIGRATIONS']: [],
          subscribers: (db['TYPEORM_SUBSCRIBERS']) ? db['TYPEORM_SUBSCRIBERS'] : [],
          cli: (db['CLI']) ? db['CLI'] : {
            "migrationsDir": `${this.base}/api/migrations`
          },
        })

      } else {
        listData.push({
          database: db['TYPEORM_DB'],
          name: db['TYPEORM_NAME'],
          type: db['TYPEORM_TYPE'],
          host: db['TYPEORM_HOST'],
          port: db['TYPEORM_PORT'],
          password: db['TYPEORM_PWD'],
          username: db['TYPEORM_USER'],
          // synchronize: db['TYPEORM_SYNC'], //bug with synchronize on mongodb
          logging: db['TYPEORM_LOG'],
          cache: !MEMORY_CACHE && db['TYPEORM_CACHE'],
          cache_duration: !MEMORY_CACHE && db['TYPEORM_CACHE'] ? db['TYPEORM_CACHE_DURATION'] : 0,
          entities: (db['TYPEORM_ENTITIES']) ? db['TYPEORM_ENTITIES'] : [],
          migrations: (db['TYPEORM_MIGRATIONS']) ? db['TYPEORM_MIGRATIONS']: [],
          subscribers: (db['TYPEORM_SUBSCRIBERS']) ? db['TYPEORM_SUBSCRIBERS'] : [],
          cli: (db['CLI']) ? db['CLI'] : {
            "migrationsDir": `${this.base}/api/migrations`
          },
          authSource: db['AUTH_SOURCE'] || 'admin',
          useUnifiedTopology: true,
          useNewUrlParser: true,
        })

      }

    })
    // @ts-ignore
    this.cluster = listData

    return this;
  }


  /**
   * @description Say if current environment is valid or not
   */
  isValid(): boolean {
    return this.errors.length === 0;
  }

  /**
   * @description Exit of current process with error messages
   *
   * @param messages
   */
  exit(messages: string|string[]): void {
    process.stdout.write('\n\x1b[41m[ERROR]\x1b[40m\n\n');
    // @ts-ignore
    process.stdout.write([].concat(messages).join('\n'));
    process.exit(0);
  }

}

const environment = Environment
  .get()
  .loads(process.versions.node)
  .extracts()
  .validates()
  .aggregates()



const typeValidation       = environment.cluster as any[];
typeValidation.forEach(data => data)


export { typeValidation }
