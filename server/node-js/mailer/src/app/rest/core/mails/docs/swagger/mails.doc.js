import DocModelRoute from "../../../../../helpers/common/doc/swagger/model.doc";
import swaggerSchema from './parts'
class MailSwagger extends  DocModelRoute{}

const mailSwagger = new MailSwagger('/mails')

//------------You can modify the default value for CRUD----------------//

//--------------------------------------------------------//

//--------------Begin Create One------------------//
mailSwagger.setData.create.one.isActive=false
/*mailSwagger.setData.create.one.data={
    parameter:{
        schema:swaggerSchema?.createOne,
    },
}*/
//--------------End Create One------------------//

//---------------------------------------------------------//

//--------------Begin Create Many------------------//
mailSwagger.setData.create.many.isActive=false
/*mailSwagger.setData.create.many.data={
    parameter:{
        schema:swaggerSchema?.createMany,
    },
}*/
//------------End Create Many----------------//

//--------------------------------------------------------//

//--------------Begin Find Many------------------//
mailSwagger.setData.find.many.isActive=false
/*mailSwagger.setData.find.many.data={
    parameter:{
        schema:swaggerSchema?.findMany,
    },
}*/
//--------------End Find Many------------------//

//--------------------------------------------------------//

//--------------Begin Find One------------------//
mailSwagger.setData.find.one.isActive=false
/*mailSwagger.setData.find.one.data={
    parameter:{
        schema:swaggerSchema?.findOne,
    },
}*/
//--------------End Find One------------------//

//--------------------------------------------------------//

//--------------Begin Update Many------------------//
mailSwagger.setData.update.many.isActive=false
/*mailSwagger.setData.update.many.data={
    parameter:{
        schema:swaggerSchema?.updateMany,
    },
}*/
//--------------End Update Many------------------//

//--------------------------------------------------------//

//--------------Begin Update One------------------//
mailSwagger.setData.update.one.isActive=false
/*mailSwagger.setData.update.one.data={
    parameter:{
        schema:swaggerSchema?.updateOne,
    },
}*/
//--------------End Update One------------------//

//--------------------------------------------------------//

//--------------Begin Delete Many------------------//
mailSwagger.setData.delete.many.isActive=false
/*mailSwagger.setData.delete.many.data={
    parameter:{
        schema:swaggerSchema?.deleteMany,
    },
}*/
//--------------End Delete Many------------------//

//--------------------------------------------------------//

//--------------Begin Delete One------------------//
mailSwagger.setData.delete.one.isActive=false
/*mailSwagger.setData.delete.one.data={
    parameter:{
        schema:swaggerSchema?.deleteOne,
    },
}*/
//--------------End Delete One------------------//

//--------------------------------------------------------//


//--------------Begin Send One------------------//
//mailSwagger.setData.send.one.isActive=false
mailSwagger.setData.send.one.data={
    parameter:{
        schema:swaggerSchema?.sendOne,
    },
}
//--------------End Send One------------------//

//-------------------------------------------------------//

//--------------Begin Send Many------------------//
//mailSwagger.setData.send.many.isActive=false
/*mailSwagger.setData.send.many.data={
    parameter:{
        schema:swaggerSchema?.sendMany,
    },
}*/
//------------End Send Many----------------//



//------------End of default modification value for CRUD----------------//

export default mailSwagger.getDefaultCRUD() //return the sub-path and template