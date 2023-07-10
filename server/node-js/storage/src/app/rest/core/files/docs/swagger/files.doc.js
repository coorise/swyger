import DocModelRoute from "../../../../../helpers/common/doc/swagger/model.doc";
import swaggerSchema from './parts'
class FileSwagger extends  DocModelRoute{}

const fileSwagger = new FileSwagger('/files/*')

//------------You can modify the default value for CRUD----------------//

//--------------------------------------------------------//

//--------------Begin Create One------------------//
//fileSwagger.setData.create.one.isActive=false
fileSwagger.setData.create.one.data={
    parameter:{
        schema:swaggerSchema?.createOne,
    },
}
//--------------End Create One------------------//

//--------------------------------------------------------//


//--------------Begin Create Many------------------//
//fileSwagger.setData.create.many.isActive=false
/*fileSwagger.setData.create.many.data={
    parameter:{
        schema:swaggerSchema?.createMany,
    },
}*/
//------------End Create Many----------------//

//--------------------------------------------------------//

//--------------Begin Find Many------------------//
//fileSwagger.setData.find.many.isActive=false
/*fileSwagger.setData.find.many.data={
    parameter:{
        schema:swaggerSchema?.findMany,
    },
}*/
//--------------End Find Many------------------//

//--------------------------------------------------------//

//--------------Begin Find One------------------//
//fileSwagger.setData.find.one.isActive=false
/*fileSwagger.setData.find.one.data={
    parameter:{
        schema:swaggerSchema?.findOne,
    },
}*/
//--------------End Find One------------------//

//--------------------------------------------------------//

//--------------Begin Update Many------------------//
//fileSwagger.setData.update.many.isActive=false
/*fileSwagger.setData.update.many.data={
    parameter:{
        schema:swaggerSchema?.updateMany,
    },
}*/
//--------------End Update Many------------------//

//--------------------------------------------------------//

//--------------Begin Update One------------------//
//fileSwagger.setData.update.one.isActive=false
/*fileSwagger.setData.update.one.data={
    parameter:{
        schema:swaggerSchema?.updateOne,
    },
}*/
//--------------End Update One------------------//

//--------------------------------------------------------//

//--------------Begin Delete Many------------------//
//fileSwagger.setData.delete.many.isActive=false
/*fileSwagger.setData.delete.many.data={
    parameter:{
        schema:swaggerSchema?.deleteMany,
    },
}*/
//--------------End Delete Many------------------//

//--------------------------------------------------------//

//--------------Begin Delete One------------------//
//fileSwagger.setData.delete.one.isActive=false
/*fileSwagger.setData.delete.one.data={
    parameter:{
        schema:swaggerSchema?.deleteOne,
    },
}*/
//--------------End Delete One------------------//

//------------End of default modification value for CRUD----------------//

export default fileSwagger.getDefaultCRUD() //return the sub-path and template