import ModelRoute from "../../../../../helpers/common/route/express";
import fileController from '../../controllers/files.controller'
import fileValidation from '../../validations/typeorm/files.validation'
import ExtrasMiddleware from "../../../../../middlewares/extras";

class FileRoute extends ModelRoute{}
const fileRoute = new FileRoute('/*',fileController)
const extrasMiddleware=new ExtrasMiddleware()
//------------You can modify the default value for CRUD----------------//

//------- Beginning of Disabling default auth for all route-----------//
fileRoute.requireAuth=[
    ...fileRoute.requireAuth,
    extrasMiddleware.required
]
//-------------End of disabling default auth-------//

//--------------Begin Create Many------------------//
//fileRoute.setHandler.create.many.isActive=false
//fileRoute.setHandler.create.many.defaultAuth=false
//fileRoute.setHandler.create.many.handlers=[fileValidation.createMany]
//fileRoute.setHandler.create.many.controller=
//------------End Create Many----------------//

//--------------------------------------------------------//

//--------------Begin Create One------------------//
//fileRoute.setHandler.create.one.isActive=false
//fileRoute.setHandler.create.one.defaultAuth=false
//fileRoute.setHandler.create.one.handlers=[fileValidation.createOne]
//fileRoute.setHandler.create.one.controller=controller
//--------------End Create One------------------//

//----------------------------------------------------------//

//--------------Begin Find Many------------------//
//fileRoute.setHandler.find.many.isActive=false
//fileRoute.setHandler.find.many.defaultAuth=false
//fileRoute.setHandler.find.many.handlers=[]
//fileRoute.setHandler.find.many.controller=controller
//--------------End Find Many------------------//

//--------------------------------------------------------//

//--------------Begin Find One------------------//
//fileRoute.setHandler.find.one.isActive=false
//fileRoute.setHandler.find.one.defaultAuth=false
//fileRoute.setHandler.find.one.handlers=[]
//fileRoute.setHandler.find.one.controller=controller
//--------------End Find One------------------//

//--------------------------------------------------------//

//--------------Begin Update Many------------------//
//fileRoute.setHandler.update.many.isActive=false
//fileRoute.setHandler.update.many.handlers=[]
//fileRoute.setHandler.update.many.controller=controller
//--------------End Update Many------------------//

//--------------------------------------------------------//

//--------------Begin Update One------------------//
//fileRoute.setHandler.update.one.isActive=false
//fileRoute.setHandler.update.one.handlers=[]
//fileRoute.setHandler.update.one.controller=controller
//--------------End Update One------------------//

//--------------------------------------------------------//

//--------------Begin Delete Many------------------//
//fileRoute.setHandler.delete.many.isActive=false
//fileRoute.setHandler.delete.many.handlers=[]
//fileRoute.setHandler.delete.many.controller=controller
//--------------End Delete Many------------------//

//--------------------------------------------------------//

//--------------Begin Delete One------------------//
//fileRoute.setHandler.delete.one.isActive=false
//fileRoute.setHandler.delete.one.handlers=[]
//fileRoute.setHandler.delete.one.controller=controller
//--------------End Delete One------------------//

//------------End of default modification value for CRUD----------------//

//---------------------------------------------------------------------------//

//------------You can modify the custom default route----------------//
fileRoute.setHandler.custom=[
    /*//--------------Begin GetMany------------------//
    {
        childPath:'/get-many',
        method:'get',
        defaultAuth:false,
        controller:fileController.getMany
    },
    //------------End GetMany----------------//

    //--------------------------------------------------------//

    //--------------Begin GetOne------------------//
    {
        childPath:'/get-one',
        method:'get',
        defaultAuth:false,
        controller:fileController.getOne
    },
    //------------End GetOne----------------//*/

    //--------------------------------------------------------//

    //--------------Begin DownloadOne------------------//
    {
        childPath:'/download-one',
        method:'get',
        defaultAuth:false,
        handlers: [extrasMiddleware.required],
        controller:fileController.getOne
    },
    //------------End DownloadOne----------------//

    //--------------------------------------------------------//

    //--------------Begin DownloadMany------------------//
    {
        childPath:'/download-many',
        method:'get',
        defaultAuth:false,
        handlers: [extrasMiddleware.required],
        controller:fileController.getMany
    },
    //------------End DownloadMany----------------//

    //--------------------------------------------------------//
]
//--------------End of modification of the custom default route------------//

const route =fileRoute.getAllRoutes()
export default {
    router:[
        '/storage', //your parent route to be used on route.use('parent',handler)
        route.router //return your handlers with sub-route
    ],
    socketRouter:{
        path:'/storage', //your parent route to be used on route.use('parent',handler)
        handlers:route.socketRouter //return your handlers with sub-route
    }
}

