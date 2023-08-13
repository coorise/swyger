//visit: https://github.com/zcoding/spa-router
import Router from "./resources/vendors/spa-router-better/es/spa-router.js";
import IndexModule from "./app/rest/index.js";
import {ServerConfig} from "./app/config/index.js";
import SwygerClient from '@swyger/client';

//console.log('ListModule')
//console.log(ApiModule)
let routes = Object.assign(
    {
        '/': {
            redirect: {
                name: 'home'
            }
        },

        '*': {
            redirect: {
                name: 'home'
            }
        },
    },
    IndexModule

)
let client=SwygerClient.init(ServerConfig)

//Note: We found that spa route got issue with parameters  on route with "-" missing,
// so we updated it to add '-'  on line 344 and 353
let adminRouter = new Router(routes,
    {
        //mode: 'history',
        //mode: 'hashbang',
        mode: 'history',
        root:'/',
       //notFound:function(){}  //global notfound function
        beforeEachEnter: function (req) {
          //you can set/get a variable like in express js
          // req.your_variable
          req.$router.go=(path='/')=> {
            location.href=path
          }

          if(!req?.client && typeof req.client !='object')
          req.client=client
        },
        beforeEachLeave: function (req) {
            //console.log('uri: ' + req.uri);
        }
    }

);
//you can set listener four a custom route
adminRouter.on('/',function (req) {

})
//you can remove path
//adminRouter.off('path')

//you can add a custom route to merge with existing route
/*adminRouter.mount('/admin',
    {
        name:'admin',
        controllers:[],
        sub:{
            '/product': {
                forward: true,
                sub: {
                    '/': {
                        //controllers: [ function(req) {console.log('forward'+ req.params);}]
                    },
                }
            },
        }

    }
);*/

export default adminRouter
