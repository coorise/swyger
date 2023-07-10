import DocModelRoute from "../../../../../helpers/common/doc/swagger/model.doc";
import swaggerSchema from './parts'
class SchemaSwagger extends  DocModelRoute{}

const schemaSwagger = new SchemaSwagger('/schemas')

//------------You can modify the default value for CRUD----------------//


//--------------------------------------------------------//

//--------------Begin Create One------------------//
//schemaSwagger.setData.create.one.isActive=false
schemaSwagger.setData.create.one.data={
    parameter:{
        schema:swaggerSchema?.createOne,
    },
}
//--------------End Create One------------------//

//---------------------------------------------------------//

//--------------Begin Create Many------------------//
//schemaSwagger.setData.create.many.isActive=false
/*schemaSwagger.setData.create.many.data={
    parameter:{
        schema:swaggerSchema?.createMany,
    },
}*/
//------------End Create Many----------------//

//--------------------------------------------------------//

//--------------Begin Find Many------------------//
//schemaSwagger.setData.find.many.isActive=false
/*schemaSwagger.setData.find.many.data={
    parameter:{
        schema:swaggerSchema?.findMany,
    },
}*/
//--------------End Find Many------------------//

//--------------------------------------------------------//

//--------------Begin Find One------------------//
//schemaSwagger.setData.find.one.isActive=false
/*schemaSwagger.setData.find.one.data={
    parameter:{
        schema:swaggerSchema?.findOne,
    },
}*/
//--------------End Find One------------------//

//--------------------------------------------------------//

//--------------Begin Update Many------------------//
//schemaSwagger.setData.update.many.isActive=false
/*schemaSwagger.setData.update.many.data={
    parameter:{
        schema:swaggerSchema?.updateMany,
    },
}*/
//--------------End Update Many------------------//

//--------------------------------------------------------//

//--------------Begin Update One------------------//
//schemaSwagger.setData.update.one.isActive=false
/*schemaSwagger.setData.update.one.data={
    parameter:{
        schema:swaggerSchema?.updateOne,
    },
}*/
//--------------End Update One------------------//

//--------------------------------------------------------//

//--------------Begin Delete Many------------------//
//schemaSwagger.setData.delete.many.isActive=false
/*schemaSwagger.setData.delete.many.data={
    parameter:{
        schema:swaggerSchema?.deleteMany,
    },
}*/
//--------------End Delete Many------------------//

//--------------------------------------------------------//

//--------------Begin Delete One------------------//
//schemaSwagger.setData.delete.one.isActive=false
/*schemaSwagger.setData.delete.one.data={
    parameter:{
        schema:swaggerSchema?.deleteOne,
    },
}*/
//--------------End Delete One------------------//

//------------End of default modification value for CRUD----------------//

export default schemaSwagger.getDefaultCRUD() //return the sub-path and template