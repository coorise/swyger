import ModelRoute from "@common/route/express";
import schemaController from '../../controllers/schemas.controller'
import schemaValidation from '../../validations/typeorm/schemas.validation'
class UserRoute extends ModelRoute{}
const schemaRoute = new UserRoute('',schemaController)

//---
schemaRoute.requireAuth=[]
//-----

//------------You can modify the default value for CRUD----------------//

//--------------Begin Create Many------------------//
//schemaRoute.setHandler.create.many.isActive=false
//schemaRoute.setHandler.create.many.handlers=[]
//schemaRoute.setHandler.create.many.controller=
//------------End Create Many----------------//

//--------------------------------------------------------//

//--------------Begin Create One------------------//
//schemaRoute.setHandler.create.one.isActive=false
schemaRoute.setHandler.create.one.handlers=[schemaValidation.createOne]
//schemaRoute.setHandler.create.one.controller=controller
//--------------End Create One------------------//

//--------------------------------------------------------//

//--------------Begin Find Many------------------//
//schemaRoute.setHandler.find.many.isActive=false
//schemaRoute.setHandler.find.many.handlers=[]
//schemaRoute.setHandler.find.many.controller=controller
//--------------End Find Many------------------//

//--------------------------------------------------------//

//--------------Begin Find One------------------//
//schemaRoute.setHandler.find.one.isActive=false
//schemaRoute.setHandler.find.one.handlers=[]
//schemaRoute.setHandler.find.one.controller=controller
//--------------End Find One------------------//

//--------------------------------------------------------//

//--------------Begin Update Many------------------//
//schemaRoute.setHandler.update.many.isActive=false
//schemaRoute.setHandler.update.many.handlers=[]
//schemaRoute.setHandler.update.many.controller=controller
//--------------End Update Many------------------//

//--------------------------------------------------------//

//--------------Begin Update One------------------//
//schemaRoute.setHandler.update.one.isActive=false
//schemaRoute.setHandler.update.one.handlers=[]
//schemaRoute.setHandler.update.one.controller=controller
//--------------End Update One------------------//

//--------------------------------------------------------//

//--------------Begin Delete Many------------------//
//schemaRoute.setHandler.delete.many.isActive=false
//schemaRoute.setHandler.delete.many.handlers=[]
//schemaRoute.setHandler.delete.many.controller=controller
//--------------End Delete Many------------------//

//--------------------------------------------------------//

//--------------Begin Delete One------------------//
//schemaRoute.setHandler.delete.one.isActive=false
//schemaRoute.setHandler.delete.one.handlers=[]
//schemaRoute.setHandler.delete.one.controller=controller
//--------------End Delete One------------------//

//------------End of default modification value for CRUD----------------//
schemaRoute.setHandler.custom=[
    {
        childPath:'/restart',
        method:'post',
        defaultAuth:false,
        controller:schemaController.restart
    }
]
let route

let ENV
if ((process.argv && process.argv.indexOf('--env') !== -1)) { // node your-script.js  --env development|production|test
    // @ts-ignore
    ENV = process.argv[process.argv.indexOf('--env') + 1].toString()
    if(ENV === "development"){
        route=schemaRoute.getAllRoutes()
        route={
            router:[
                '/schemas', //your parent route to be used on route.use('parent',handler)
                route.router //return your handlers with sub-route
            ],
            socketRouter:{
                path:'/schemas', //your parent route to be used on route.use('parent',handler)
                handlers:route.socketRouter //return your handlers with sub-route
            }
        }
    }else {
        route={}
    }
}
export default route

