import ModelRoute from "@common/route/express";
import RefreshTokenController from '../../controllers/refresh_tokens.controller'

class RefreshTokenRoute extends ModelRoute{}
const refreshTokenRoute = new RefreshTokenRoute('',RefreshTokenController)

//---
refreshTokenRoute.requireAuth=[]
//-----

//------------You can modify the default value for CRUD----------------//

//--------------Begin Create Many------------------//
//refreshTokenRoute.setHandler.create.many.isActive=false
//refreshTokenRoute.setHandler.create.many.handlers=[]
//refreshTokenRoute.setHandler.create.many.controller=
//------------End Create Many----------------//

//--------------------------------------------------------//

//--------------Begin Create One------------------//
//refreshTokenRoute.setHandler.create.one.isActive=false
//refreshTokenRoute.setHandler.create.one.handlers=[]
//refreshTokenRoute.setHandler.create.one.controller=controller
//--------------End Create One------------------//

//--------------------------------------------------------//

//--------------Begin Find Many------------------//
//refreshTokenRoute.setHandler.find.many.isActive=false
//refreshTokenRoute.setHandler.find.many.handlers=[]
//refreshTokenRoute.setHandler.find.many.controller=controller
//--------------End Find Many------------------//

//--------------------------------------------------------//

//--------------Begin Find One------------------//
//refreshTokenRoute.setHandler.find.one.isActive=false
//refreshTokenRoute.setHandler.find.one.handlers=[]
//refreshTokenRoute.setHandler.find.one.controller=controller
//--------------End Find One------------------//

//--------------------------------------------------------//

//--------------Begin Update Many------------------//
//refreshTokenRoute.setHandler.update.many.isActive=false
//refreshTokenRoute.setHandler.update.many.handlers=[]
//refreshTokenRoute.setHandler.update.many.controller=controller
//--------------End Update Many------------------//

//--------------------------------------------------------//

//--------------Begin Update One------------------//
//refreshTokenRoute.setHandler.update.one.isActive=false
//refreshTokenRoute.setHandler.update.one.handlers=[]
//refreshTokenRoute.setHandler.update.one.controller=controller
//--------------End Update One------------------//

//--------------------------------------------------------//

//--------------Begin Delete Many------------------//
//refreshTokenRoute.setHandler.delete.many.isActive=false
//refreshTokenRoute.setHandler.delete.many.handlers=[]
//refreshTokenRoute.setHandler.delete.many.controller=controller
//--------------End Delete Many------------------//

//--------------------------------------------------------//

//--------------Begin Delete One------------------//
//refreshTokenRoute.setHandler.delete.one.isActive=false
//refreshTokenRoute.setHandler.delete.one.handlers=[]
//refreshTokenRoute.setHandler.delete.one.controller=controller
//--------------End Delete One------------------//

//------------End of default modification value for CRUD----------------//



const route=refreshTokenRoute.getDefaultCRUD()
export default {
    router:[
        '/refresh-token', //your parent route to be used on route.use('parent',handler)
        route.router //return your handlers with sub-route
    ],
    socketRouter:{
        path:'/refresh-token', //your parent route to be used on route.use('parent',handler)
        handlers:route.socketRouter //return your handlers with sub-route
    }
}

