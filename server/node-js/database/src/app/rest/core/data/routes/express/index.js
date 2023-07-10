import ModelRoute from "@common/route/express";
import dataController from '../../controllers/data.controller'
import dataValidation from '../../validations/typeorm/data.validation'
import ExtrasMiddleware from "../../../../../middlewares/extras";
class DataRoute extends ModelRoute{}
const dataRoute = new DataRoute('*',dataController)
const extrasMiddleware=new ExtrasMiddleware()
//---
dataRoute.requireAuth=[
    ...dataRoute.requireAuth,
    extrasMiddleware.required
]
//-----

//------------You can modify the default value for CRUD----------------//

//--------------Begin Create Many------------------//
//dataRoute.setHandler.create.many.isActive=false
//dataRoute.setHandler.create.one.handlers=[dataValidation.createMany]
//dataRoute.setHandler.create.many.controller=
//------------End Create Many----------------//

//--------------------------------------------------------//

//--------------Begin Create One------------------//
//dataRoute.setHandler.create.one.isActive=false
//dataRoute.setHandler.create.one.handlers=[dataValidation.createOne]
//dataRoute.setHandler.create.one.controller=controller
//--------------End Create One------------------//

//--------------------------------------------------------//

//--------------Begin Find Many------------------//
//dataRoute.setHandler.find.many.isActive=false
//dataRoute.setHandler.find.many.handlers=[]
//dataRoute.setHandler.find.many.controller=controller
//--------------End Find Many------------------//

//--------------------------------------------------------//

//--------------Begin Find One------------------//
//dataRoute.setHandler.find.one.isActive=false
//dataRoute.setHandler.find.one.handlers=[]
//dataRoute.setHandler.find.one.controller=controller
//--------------End Find One------------------//

//--------------------------------------------------------//

//--------------Begin Update Many------------------//
//dataRoute.setHandler.update.many.isActive=false
//dataRoute.setHandler.update.many.handlers=[]
//dataRoute.setHandler.update.many.controller=controller
//--------------End Update Many------------------//

//--------------------------------------------------------//

//--------------Begin Update One------------------//
//dataRoute.setHandler.update.one.isActive=false
//dataRoute.setHandler.update.one.handlers=[]
//dataRoute.setHandler.update.one.controller=controller
//--------------End Update One------------------//

//--------------------------------------------------------//

//--------------Begin Delete Many------------------//
//dataRoute.setHandler.delete.many.isActive=false
//dataRoute.setHandler.delete.many.handlers=[]
//dataRoute.setHandler.delete.many.controller=controller
//--------------End Delete Many------------------//

//--------------------------------------------------------//

//--------------Begin Delete One------------------//
//dataRoute.setHandler.delete.one.isActive=false
//dataRoute.setHandler.delete.one.handlers=[]
//dataRoute.setHandler.delete.one.controller=controller
//--------------End Delete One------------------//

//------------End of default modification value for CRUD----------------//

const route=dataRoute.getDefaultCRUD()
export default {
    router:[
        '/data', //your parent route to be used on route.use('parent',handler)
        route.router //return your handlers with sub-route
    ],
    socketRouter:{
        path:'/data', //your parent route to be used on route.use('parent',handler)
        handlers:route.socketRouter //return your handlers with sub-route
    }
}

