const TemplateSchema=(name)=>{
    name=name.toLowerCase()
    const SingularName=name.replace(/s$/,'')
    const PluralName=(name.match(/s$/))?name:name+'s'
    const ClassName=SingularName.replace(SingularName.charAt(0),SingularName.charAt(0).toUpperCase())
    return `
import DocModelRoute from "../../../../helpers/common/doc/swagger/model.doc";
import swaggerSchema from './parts'
class ${ClassName}Swagger extends  DocModelRoute{}

const ${SingularName}Swagger = new ${ClassName}Swagger('/${PluralName}')

//------------You can modify the default value for CRUD----------------//

//--------------------------------------------------------//

//--------------Begin Create One------------------//
${SingularName}Swagger.setData.create.one.isActive=false
/*${SingularName}Swagger.setData.create.one.data={
    parameter:{
        schema:swaggerSchema?.createOne,
    },
}*/
//--------------End Create One------------------//

//---------------------------------------------------------//

//--------------Begin Create Many------------------//
${SingularName}Swagger.setData.create.many.isActive=false
/*${SingularName}Swagger.setData.create.many.data={
    parameter:{
        schema:swaggerSchema?.createMany,
    },
}*/
//------------End Create Many----------------//

//--------------------------------------------------------//

//--------------Begin Find Many------------------//
${SingularName}Swagger.setData.find.many.isActive=false
/*${SingularName}Swagger.setData.find.many.data={
    parameter:{
        schema:swaggerSchema?.findMany,
    },
}*/
//--------------End Find Many------------------//

//--------------------------------------------------------//

//--------------Begin Find One------------------//
${SingularName}Swagger.setData.find.one.isActive=false
/*${SingularName}Swagger.setData.find.one.data={
    parameter:{
        schema:swaggerSchema?.findOne,
    },
}*/
//--------------End Find One------------------//

//--------------------------------------------------------//

//--------------Begin Update Many------------------//
${SingularName}Swagger.setData.update.many.isActive=false
/*${SingularName}Swagger.setData.update.many.data={
    parameter:{
        schema:swaggerSchema?.updateMany,
    },
}*/
//--------------End Update Many------------------//

//--------------------------------------------------------//

//--------------Begin Update One------------------//
${SingularName}Swagger.setData.update.one.isActive=false
/*${SingularName}Swagger.setData.update.one.data={
    parameter:{
        schema:swaggerSchema?.updateOne,
    },
}*/
//--------------End Update One------------------//

//--------------------------------------------------------//

//--------------Begin Delete Many------------------//
${SingularName}Swagger.setData.delete.many.isActive=false
/*${SingularName}Swagger.setData.delete.many.data={
    parameter:{
        schema:swaggerSchema?.deleteMany,
    },
}*/
//--------------End Delete Many------------------//

//---------------------------------------------------------//

//--------------Begin Delete One------------------//
${SingularName}Swagger.setData.delete.one.isActive=false
/*${SingularName}Swagger.setData.delete.one.data={
    parameter:{
        schema:swaggerSchema?.deleteOne,
    },
}*/
//--------------End Delete One------------------//

//--------------------------------------------------------//

//--------------Begin Send One------------------//
//${SingularName}Swagger.setData.send.one.isActive=false
${SingularName}Swagger.setData.send.one.data={
    parameter:{
        schema:swaggerSchema?.sendOne,
    },
}
//--------------End Send One------------------//

//---------------------------------------------------//

//--------------Begin Send Many------------------//
//${SingularName}Swagger.setData.send.many.isActive=false
/*${SingularName}Swagger.setData.send.many.data={
    parameter:{
        schema:swaggerSchema?.sendMany,
    },
}*/
//------------End Send Many----------------//


//--------------------------------------------------------//


//------------End of default modification value for CRUD----------------//

//------------You can add or modify the custom default route----------------//
/*${SingularName}.setHandler.custom=[
    //--------------Example Begin GetMany------------------//
    {
        childPath:'/get-many',
        method:'get',
        defaultAuth:false,
        data:{
          parameter:{
            description:'Param for your item',
            schema:${SingularName}Schema.getMany
          }
        }
    },
    //------------Example End GetMany----------------//

    //--------------------------------------------------------//

    //--------------Example Begin GetOne------------------//
    {
        childPath:'/get-one',
        method:'get',
        defaultAuth:false,
        data:{
          parameter:{
            description:'Param for your item',
            schema:${SingularName}Schema.getMany
          }
        }
    },
    //------------Example End GetOne----------------//

    //--------------------------------------------------------//
]*/
//--------------End of modification of the custom default route------------//

export default ${SingularName}Swagger.getDefaultCRUD() //return the sub-path and template
`
}
export default TemplateSchema