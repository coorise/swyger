import ModelRoute from "@common/route/express";
import schemaController from '../../controllers/schemas.controller'
import schemaValidation from '../../validations/schemas.validation'
class SchemaRoute extends ModelRoute{}
const schemaRoute = new SchemaRoute('',schemaController)

//---
//schemaRoute.requireAuth=[]
//-----

//------------You can modify the default value for CRUD----------------//

//--------------Begin Create Many------------------//
//schemaRoute.setHandler.create.many.isActive=false
schemaRoute.setHandler.create.many.handlers=[schemaValidation.createMany]
//schemaRoute.setHandler.create.many.controller=
//------------End Create Many----------------//

//--------------------------------------------------------//

//--------------Begin Create One------------------//
//schemaRoute.setHandler.create.one.isActive=false
schemaRoute.setHandler.create.one.handlers=[schemaValidation.createOne]
//schemaRoute.setHandler.create.one.controller=controller
//--------------End Create One------------------//

//--------------------------------------------------------//

//--------------Begin Send One------------------//
schemaRoute.setHandler.send.one.isActive=false
//schemaRoute.setHandler.send.one.handlers=[schemaValidation.sendOne]
//schemaRoute.setHandler.send.one.controller=controller
//--------------End Send One------------------//

//--------------------------------------------------------//

//--------------Begin Send Many------------------//
schemaRoute.setHandler.send.many.isActive=false
//schemaRoute.setHandler.send.many.handlers=[schemaValidation.sendMany]
//schemaRoute.setHandler.send.many.controller=
//------------End Send Many----------------//

//------------You can modify the custom default route----------------//

schemaRoute.setHandler.custom=[
    //--------------Begin SendOne Mail------------------//
    {
        childPath:'/restart',
        method:'post',
        defaultAuth:false,
        controller:schemaController.restart
    },
    //------------End SendOne Mail----------------//

    //--------------------------------------------------------//

    //--------------Begin SendOne Mail------------------//
    {
        childPath:'/restart',
        method:'post',
        defaultAuth:false,
        controller:schemaController.restart
    }
    //------------End SendOne Mail----------------//

    //--------------------------------------------------------//
]

//------------End of default modification value for CRUD----------------//


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

