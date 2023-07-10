const TemplateRouteExpress=(name,path='api')=>{
    name=name.toLowerCase()
    const SingularName=name.replace(/s$/,'')
    const PluralName=(name.match(/s$/))?name:name+'s'
    const ClassName=SingularName.replace(SingularName.charAt(0),SingularName.charAt(0).toUpperCase())
    return {
        route:`
{
  "route": "@${path}/${PluralName}/routes/express"
}`,
        express:`
import ModelRoute from "@common/route/express";
import ${SingularName}Controller from '../../controllers/${PluralName}.controller'
import ${SingularName}Validation from '../../validations/${PluralName}.validation'

class ${ClassName}Route extends ModelRoute{}
const ${SingularName}Route = new ${ClassName}Route('',${SingularName}Controller)

//---
${SingularName}Route.requireAuth=[]
//-----

//------------You can modify the default value for CRUD----------------//

//--------------Begin Create Many------------------//
${SingularName}Route.setHandler.create.many.isActive=false
//${SingularName}Route.setHandler.create.many.handlers=[]
//${SingularName}Route.setHandler.create.many.controller=
//------------End Create Many----------------//

//--------------------------------------------------------//

//--------------Begin Create One------------------//
${SingularName}Route.setHandler.create.one.isActive=false
//${SingularName}Route.setHandler.create.one.handlers=[${SingularName}Validation.createOne]
//${SingularName}Route.setHandler.create.one.controller=controller
//--------------End Create One------------------//

//--------------------------------------------------------//

//--------------Begin Find Many------------------//
${SingularName}Route.setHandler.find.many.isActive=false
//${SingularName}Route.setHandler.find.many.handlers=[]
//${SingularName}Route.setHandler.find.many.controller=controller
//--------------End Find Many------------------//

//--------------------------------------------------------//

//--------------Begin Find One------------------//
${SingularName}Route.setHandler.find.one.isActive=false
//${SingularName}Route.setHandler.find.one.handlers=[]
//${SingularName}Route.setHandler.find.one.controller=controller
//--------------End Find One------------------//

//--------------------------------------------------------//

//--------------Begin Update Many------------------//
${SingularName}Route.setHandler.update.many.isActive=false
//${SingularName}Route.setHandler.update.many.handlers=[]
//${SingularName}Route.setHandler.update.many.controller=controller
//--------------End Update Many------------------//

//--------------------------------------------------------//

//--------------Begin Update One------------------//
${SingularName}Route.setHandler.update.one.isActive=false
//${SingularName}Route.setHandler.update.one.handlers=[]
//${SingularName}Route.setHandler.update.one.controller=controller
//--------------End Update One------------------//

//--------------------------------------------------------//

//--------------Begin Delete Many------------------//
${SingularName}Route.setHandler.delete.many.isActive=false
//${SingularName}Route.setHandler.delete.many.handlers=[]
//${SingularName}Route.setHandler.delete.many.controller=controller
//--------------End Delete Many------------------//

//--------------------------------------------------------//

//--------------Begin Delete One------------------//
${SingularName}Route.setHandler.delete.one.isActive=false
//${SingularName}Route.setHandler.delete.one.handlers=[]
//${SingularName}Route.setHandler.delete.one.controller=controller
//--------------End Delete One------------------//

//--------------------------------------------------------//

//--------------Begin Send Many------------------//
//${SingularName}Route.setHandler.send.many.isActive=false
${SingularName}Route.setHandler.send.many.handlers=[${SingularName}Validation.sendMany]
//${SingularName}Route.setHandler.send.many.controller=
//------------End Send Many----------------//

//--------------------------------------------------------//

//--------------Begin Send One------------------//
//${SingularName}Route.setHandler.send.one.isActive=false
${SingularName}Route.setHandler.send.one.handlers=[${SingularName}Validation.sendOne]
//${SingularName}Route.setHandler.send.one.controller=controller
//--------------End Send One------------------//

//--------------------------------------------------------//


//------------End of default modification value for CRUD----------------//

//------------You can add or modify the custom default route----------------//
/*${SingularName}.setHandler.custom=[
    //--------------Example Begin GetMany------------------//
    {
        childPath:'/get-many',
        method:'get',
        defaultAuth:false,
        controller:${SingularName}Controller.getMany
    },
    //------------Example End GetMany----------------//

    //--------------------------------------------------------//

    //--------------Example Begin GetOne------------------//
    {
        childPath:'/get-one',
        method:'get',
        defaultAuth:false,
        controller:${SingularName}Controller.getOne
    },
    //------------Example End GetOne----------------//

    //--------------------------------------------------------//
]*/
//--------------End of modification of the custom default route------------//

const route=${SingularName}Route.getDefaultCRUD()
export default {
    router:[
        '/${SingularName}s', //your parent route to be used on route.use('parent',handler)
        route.router //return your handlers with sub-route
    ],
    socketRouter:{
        path:'/${SingularName}s', //your parent route to be used on route.use('parent',handler)
        handlers:route.socketRouter //return your handlers with sub-route
    }
}

`
    }
}
export default TemplateRouteExpress