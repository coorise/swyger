import {Base} from "../../index";
import mongo from 'mongodb'

let base = Base
//let localhost = 'host.docker.internal '
//let localhost = '192.168.116.12'
let localhost = process.env.DB_HOST || 'localhost'
let port=process.env.DB_PORT || 27017

//create database for mongo
let dbName=process.env.DB_NAME||'swyger_database'
let user={
    username:process.env.DB_USERNAME||'root',
    password:process.env.DB_PASSWORD||'',
}

let mongoClient=mongo.MongoClient
let url="mongodb://"+user.username+':'+user.password+'@'+localhost+":"+port+"/"+dbName+'?authSource=admin'
try {
    mongoClient?.connect(url,{useNewUrlParser:true, useUnifiedTopology: true }, (err, db) => {})
        ?.then(()=>{})
        ?.catch(()=>{})
}catch (e) {

}
const baseOptions = {
    "TYPEORM_SYNC": true,
    "TYPEORM_LOG": false,
    "CLI": {
        /*In Production mode , for an existing  model don't forget to : npm run typeorm migration:generate  -- -- -n base-migration -d src/api/users/database/typeorm/migrations -o ( -o for --outputJS)
         then: nmp run typeorm migration:run
         the undo cmd is :npm run typeorm migration:revert
         the show migrations cmd  is:npm run typeorm migration:show
         to drop :npm run typeorm migration:drop
         */

        //"migrationsDir": `${base}/api/migrations`, | >npm run typeorm migration:create -- -- -n usersMigration -d src/api/users/database/typeorm/migrations
        //"entitiesDir": `${base}/api/core/models`, | >npm run typeorm entity:create -- -- -n users.model -d src/api/users/database/typeorm/models
        //"subscribersDir": `${base}/api/core/subscribers` | >npm run typeorm subscriber:create  -- -- -n UserSubscriber -d src/api/users/database/typeorm/subscribers
    }
}

const baseMySQLOptions = Object.assign(
    {
        "TYPEORM_ENTITIES": [
            `${base}/app/services/database/typeorm/entities/mysql/**/*.model{.ts,.js}`, // will create table automatically in dev mode
        ],
        "TYPEORM_MIGRATIONS": [
            `${base}/app/core/**/database/typeorm/migrations/mysql/**/*{.ts,.js}`,
            `${base}/app/api/**/database/typeorm/migrations/mysql/**/*{.ts,.js}`,
        ],
        "TYPEORM_SUBSCRIBERS": [
            `${base}/app/core/**/database/typeorm/subscribers/mysql/**/*{.ts,.js}`,
            `${base}/app/api/**/database/typeorm/subscribers/mysql/**/*{.ts,.js}`
        ],
    },
    baseOptions // must be at the end
)
const baseMongoOptions = Object.assign(
    {
        "TYPEORM_ENTITIES": [
            `${base}/app/services/database/typeorm/entities/mongodb/**/*.model{.ts,.js}`, // will create table automatically in dev mode
        ],

        //Please visit: https://typeorm.biunav.com/en/migrations.html#running-and-reverting-migrations
        "TYPEORM_MIGRATIONS": [
            `${base}/app/core/**/database/typeorm/migrations/mongodb/**/*{.ts,.js}`,
            `${base}/app/api/**/database/typeorm/migrations/mongodb/**/*{.ts,.js}`,
        ],
        "TYPEORM_SUBSCRIBERS": [
            `${base}/app/core/**/database/typeorm/subscribers/mongodb/**/*{.ts,.js}`,
            `${base}/app/api/**/database/typeorm/subscribers/mongodb/**/*{.ts,.js}`,
        ],
    },
    baseOptions // must be at the end
)
const dbList = [
    /*Object.assign({
      "TYPEORM_TYPE": "mysql",
      "TYPEORM_NAME": "default",
      //"TYPEORM_HOST": "host.docker.internal",
      "TYPEORM_HOST": localhost,
      "TYPEORM_PORT": 3307,
      "TYPEORM_USER": "root",
      "TYPEORM_PWD": "Password@123",
      "TYPEORM_DB": "swyger_auth",

    },baseMySQLOptions),*/
    Object.assign({
        "TYPEORM_TYPE": "mongodb",
        //"TYPEORM_NAME": "base2",
        "TYPEORM_NAME": "default",
        //"TYPEORM_HOST": "host.docker.internal",
        "TYPEORM_HOST": localhost,
        //"TYPEORM_PORT": 28017,
        "AUTH_SOURCE": 'admin',
        "TYPEORM_PORT": port,
        "TYPEORM_USER": user.username,
        "TYPEORM_PWD": user.password,
        "TYPEORM_DB": dbName,
    },baseMongoOptions),
    /*Object.assign({
      "TYPEORM_TYPE": "mysql",
      "TYPEORM_NAME": "base3",
      //"TYPEORM_HOST": "host.docker.internal",
      "TYPEORM_HOST": localhost,
      "TYPEORM_PORT": 3307,
      "TYPEORM_USER": "root",
      "TYPEORM_PWD": "Password@123",
      "TYPEORM_DB": "swyger_auth_2",

    },baseMySQLOptions),*/
]

export default dbList;

