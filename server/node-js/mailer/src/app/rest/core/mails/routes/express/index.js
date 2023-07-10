import ModelRoute from "@common/route/express";
import mailController from '../../controllers/mails.controller'
import mailValidation from '../../validations/mails.validation'
class MailRoute extends ModelRoute{}
import adminMiddleware from '../../../../../middlewares/admin'
const mailRoute = new MailRoute('',mailController)

//---
//mailRoute.requireAuth=[]
//-----

//------------You can modify the default value for CRUD----------------//

//--------------Begin Create Many------------------//
mailRoute.setHandler.create.many.isActive=false
//mailRoute.setHandler.create.many.handlers=[]
//mailRoute.setHandler.create.many.controller=
//------------End Create Many----------------//

//--------------------------------------------------------//

//--------------Begin Create One------------------//
mailRoute.setHandler.create.one.isActive=false
//mailRoute.setHandler.create.one.handlers=[mailValidation.createOne]
//mailRoute.setHandler.create.one.controller=controller
//--------------End Create One------------------//

//--------------------------------------------------------//

//--------------Begin Find Many------------------//
mailRoute.setHandler.find.many.isActive=false
//mailRoute.setHandler.find.many.handlers=[]
//mailRoute.setHandler.find.many.controller=controller
//--------------End Find Many------------------//

//--------------------------------------------------------//

//--------------Begin Find One------------------//
mailRoute.setHandler.find.one.isActive=false
//mailRoute.setHandler.find.one.handlers=[]
//mailRoute.setHandler.find.one.controller=controller
//--------------End Find One------------------//

//--------------------------------------------------------//

//--------------Begin Update Many------------------//
mailRoute.setHandler.update.many.isActive=false
//mailRoute.setHandler.update.many.handlers=[]
//mailRoute.setHandler.update.many.controller=controller
//--------------End Update Many------------------//

//--------------------------------------------------------//

//--------------Begin Update One------------------//
mailRoute.setHandler.update.one.isActive=false
//mailRoute.setHandler.update.one.handlers=[]
//mailRoute.setHandler.update.one.controller=controller
//--------------End Update One------------------//

//--------------------------------------------------------//

//--------------Begin Delete Many------------------//
mailRoute.setHandler.delete.many.isActive=false
//mailRoute.setHandler.delete.many.handlers=[]
//mailRoute.setHandler.delete.many.controller=controller
//--------------End Delete Many------------------//

//--------------------------------------------------------//

//--------------Begin Delete One------------------//
mailRoute.setHandler.delete.one.isActive=false
//mailRoute.setHandler.delete.one.handlers=[]
//mailRoute.setHandler.delete.one.controller=controller
//--------------End Delete One------------------//

//--------------------------------------------------------//

//--------------Begin Send Many------------------//
//mailRoute.setHandler.send.many.isActive=false
mailRoute.setHandler.send.many.handlers=[mailValidation.sendMany]
//mailRoute.setHandler.send.many.controller=
//------------End Send Many----------------//

//--------------------------------------------------------//

//--------------Begin Send One------------------//
//mailRoute.setHandler.send.one.isActive=false
mailRoute.setHandler.send.one.handlers=[mailValidation.sendOne]
//mailRoute.setHandler.send.one.controller=controller
//--------------End Send One------------------//

//--------------------------------------------------------//


//------------End of default modification value for CRUD----------------//

//------------You can modify the custom default route----------------//
mailRoute.setHandler.custom=[
    //--------------Begin SendOne Mail------------------//
    {
        childPath:'/admin/send-one',
        method:'post',
        handlers:[adminMiddleware.isAdmin],
        defaultAuth:false,
        controller:mailController.sendOne
    },
    //------------End SendOne Mail----------------//

    //--------------------------------------------------------//

    //--------------Begin SendOne Mail------------------//
    {
        childPath:'/admin/send-many',
        method:'post',
        handlers:[adminMiddleware.isAdmin],
        defaultAuth:false,
        controller:mailController.sendMany
    },
    //------------End SendOne Mail----------------//
]
//------------You can modify the custom default route----------------//

const route=mailRoute.getAllRoutes()
export default {
    router:[
        '/mails', //your parent route to be used on route.use('parent',handler)
        route.router //return your handlers with sub-route
    ],
    socketRouter:{
        path:'/mails', //your parent route to be used on route.use('parent',handler)
        handlers:route.socketRouter //return your handlers with sub-route
    }
}

