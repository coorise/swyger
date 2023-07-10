import DocModelRoute from "../../../../../helpers/common/doc/swagger/model.doc";
import swaggerSchema from './parts'
class UserSwagger extends  DocModelRoute{}

const userSwagger = new UserSwagger('/users')

//------------You can modify the default value for CRUD----------------//

//--------------------------------------------------------//

//--------------Begin Create One------------------//
//userSwagger.setData.create.one.isActive=false
userSwagger.setData.create.one.data={
    parameter:{
        schema:swaggerSchema?.createOne,
    },
}
//--------------End Create One------------------//

//-------------------------------------------------------//

//--------------Begin Create Many------------------//
//userSwagger.setData.create.many.isActive=false
/*userSwagger.setData.create.many.data={
    parameter:{
        schema:swaggerSchema?.createMany,
    },
}*/
//------------End Create Many----------------//


//--------------------------------------------------------//

//--------------Begin Find Many------------------//
//userSwagger.setData.find.many.isActive=false
userSwagger.setData.find.many.data={
    parameter:{
        schema:swaggerSchema?.findMany,
    },
}
//--------------End Find Many------------------//

//--------------------------------------------------------//

//--------------Begin Find One------------------//
//userSwagger.setData.find.one.isActive=false
/*userSwagger.setData.find.one.data={
    parameter:{
        schema:swaggerSchema?.findOne,
    },
}*/
//--------------End Find One------------------//

//--------------------------------------------------------//

//--------------Begin Update Many------------------//
//userSwagger.setData.update.many.isActive=false
/*userSwagger.setData.update.many.data={
    parameter:{
        schema:swaggerSchema?.updateMany,
    },
}*/
//--------------End Update Many------------------//

//--------------------------------------------------------//

//--------------Begin Update One------------------//
//userSwagger.setData.update.one.isActive=false
/*userSwagger.setData.update.one.data={
    parameter:{
        schema:swaggerSchema?.updateOne,
    },
}*/
//--------------End Update One------------------//

//--------------------------------------------------------//

//--------------Begin Delete Many------------------//
//userSwagger.setData.delete.many.isActive=false
/*userSwagger.setData.delete.many.data={
    parameter:{
        schema:swaggerSchema?.deleteMany,
    },
}*/
//--------------End Delete Many------------------//

//--------------------------------------------------------//

//--------------Begin Delete One------------------//
//userSwagger.setData.delete.one.isActive=false
/*userSwagger.setData.delete.one.data={
    parameter:{
        schema:swaggerSchema?.deleteOne,
    },
}*/
//--------------End Delete One------------------//

//------------End of default modification value for CRUD----------------//

export default userSwagger.getDefaultCRUD() //return the sub-path and template