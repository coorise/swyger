import DocModelRoute from "../../../../../helpers/common/doc/swagger/model.doc";
import swaggerSchema from './parts'
class StorageSwagger extends  DocModelRoute{}

const dataSwagger = new StorageSwagger('/data/*')

//------------You can modify the default value for CRUD----------------//

//--------------------------------------------------------//

//--------------Begin Create One------------------//
//dataSwagger.setData.create.one.isActive=false
dataSwagger.setData.create.one.data={
    parameter:{
        schema:swaggerSchema?.createOne,
    },
}
//--------------End Create One------------------//

//-------------------------------------------------------//

//--------------Begin Create Many------------------//
//dataSwagger.setData.create.many.isActive=false
/*dataSwagger.setData.create.many.data={
    parameter:{
        schema:swaggerSchema?.createMany,
    },
}*/
//------------End Create Many----------------//


//--------------------------------------------------------//

//--------------Begin Find Many------------------//
//dataSwagger.setData.find.many.isActive=false
/*dataSwagger.setData.find.many.data={
    parameter:{
        schema:swaggerSchema?.findMany,
    },
}*/
//--------------End Find Many------------------//

//--------------------------------------------------------//

//--------------Begin Find One------------------//
//dataSwagger.setData.find.one.isActive=false
/*dataSwagger.setData.find.one.data={
    parameter:{
        schema:swaggerSchema?.findOne,
    },
}*/
//--------------End Find One------------------//

//--------------------------------------------------------//

//--------------Begin Update Many------------------//
//dataSwagger.setData.update.many.isActive=false
/*dataSwagger.setData.update.many.data={
    parameter:{
        schema:swaggerSchema?.updateMany,
    },
}*/
//--------------End Update Many------------------//

//--------------------------------------------------------//

//--------------Begin Update One------------------//
//dataSwagger.setData.update.one.isActive=false
/*dataSwagger.setData.update.one.data={
    parameter:{
        schema:swaggerSchema?.updateOne,
    },
}*/
//--------------End Update One------------------//

//--------------------------------------------------------//

//--------------Begin Delete Many------------------//
//dataSwagger.setData.delete.many.isActive=false
/*dataSwagger.setData.delete.many.data={
    parameter:{
        schema:swaggerSchema?.deleteMany,
    },
}*/
//--------------End Delete Many------------------//

//--------------------------------------------------------//

//--------------Begin Delete One------------------//
//dataSwagger.setData.delete.one.isActive=false
/*dataSwagger.setData.delete.one.data={
    parameter:{
        schema:swaggerSchema?.deleteOne,
    },
}*/
//--------------End Delete One------------------//

//------------End of default modification value for CRUD----------------//

export default dataSwagger.getDefaultCRUD() //return the sub-path and template