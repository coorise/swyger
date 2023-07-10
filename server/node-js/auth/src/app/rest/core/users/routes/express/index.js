import ModelRoute from "@common/route/express";
import userController from '../../controllers/users.controller'
import userValidation from '../../validations/typeorm/users.validation'
import ExtrasMiddleware from "../../../../../middlewares/extras";
class UserRoute extends ModelRoute{}
const userRoute = new UserRoute('/*',userController)
const extrasMiddleware=new ExtrasMiddleware()

//---
userRoute.requireAuth=[
    ...userRoute.requireAuth,
    extrasMiddleware.required
]
//-----

//------------You can modify the default value for CRUD----------------//

//--------------Begin Create Many------------------//
//userRoute.setHandler.create.many.isActive=false
//userRoute.setHandler.create.many.path=userRoute.parentPath+'/create-many'
userRoute.setHandler.create.one.handlers=[userValidation.createMany]
//userRoute.setHandler.create.many.controller=
//------------End Create Many----------------//

//--------------------------------------------------------//

//--------------Begin Create One------------------//
//userRoute.setHandler.create.one.isActive=false
userRoute.setHandler.create.one.handlers=[userValidation.createOne]
//userRoute.setHandler.create.one.controller=controller
//--------------End Create One------------------//

//--------------------------------------------------------//

//--------------Begin Find Many------------------//
//userRoute.setHandler.find.many.isActive=false
//userRoute.setHandler.find.many.handlers=[]
//userRoute.setHandler.find.many.controller=controller
//--------------End Find Many------------------//

//--------------------------------------------------------//

//--------------Begin Find One------------------//
//userRoute.setHandler.find.one.isActive=false
//userRoute.setHandler.find.one.handlers=[]
//userRoute.setHandler.find.one.controller=controller
//--------------End Find One------------------//

//--------------------------------------------------------//

//--------------Begin Update Many------------------//
//userRoute.setHandler.update.many.isActive=false
//userRoute.setHandler.update.many.handlers=[]
//userRoute.setHandler.update.many.controller=controller
//--------------End Update Many------------------//

//--------------------------------------------------------//

//--------------Begin Update One------------------//
//userRoute.setHandler.update.one.isActive=false
//userRoute.setHandler.update.one.handlers=[]
//userRoute.setHandler.update.one.controller=controller
//--------------End Update One------------------//

//--------------------------------------------------------//

//--------------Begin Delete Many------------------//
//userRoute.setHandler.delete.many.isActive=false
//userRoute.setHandler.delete.many.handlers=[]
//userRoute.setHandler.delete.many.controller=controller
//--------------End Delete Many------------------//

//--------------------------------------------------------//

//--------------Begin Delete One------------------//
//userRoute.setHandler.delete.one.isActive=false
//userRoute.setHandler.delete.one.handlers=[]
//userRoute.setHandler.delete.one.controller=controller
//--------------End Delete One------------------//

//------------End of default modification value for CRUD----------------//

const route=userRoute.getDefaultCRUD()
export default {
    router:[
        '/users', //your parent route to be used on route.use('parent',handler)
        route.router //return your handlers with sub-route
    ],
    socketRouter:{
        path:'/users', //your parent route to be used on route.use('parent',handler)
        handlers:route.socketRouter //return your handlers with sub-route
    }
}

