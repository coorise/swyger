import DocModelRoute from "@common/doc/swagger/model.doc";
import {
    findMany,
    findOne,
    createMany,
    createOne,
    updateMany,
    updateOne,
    deleteMany,
    deleteOne
} from './parts'
class RefreshTokenSwagger extends  DocModelRoute{}

const refreshTokenSwagger = new RefreshTokenSwagger('/refresh-tokens')

//------------You can modify the default value for CRUD----------------//

//--------------Begin Create Many------------------//
//refreshTokenSwagger.setData.create.many.isActive=false
refreshTokenSwagger.setData.create.many.data={
    parameter:{
        schema:createMany,
    },
}
//------------End Create Many----------------//

//--------------------------------------------------------//

//--------------Begin Create One------------------//
//refreshTokenSwagger.setData.create.one.isActive=false
refreshTokenSwagger.setData.create.one.data={
    parameter:{
        schema:createOne,
    },
}
//--------------End Create One------------------//

//--------------------------------------------------------//

//--------------Begin Find Many------------------//
//refreshTokenSwagger.setData.find.many.isActive=false
refreshTokenSwagger.setData.find.many.data={
    parameter:{
        schema:findMany,
    },
}
//--------------End Find Many------------------//

//--------------------------------------------------------//

//--------------Begin Find One------------------//
//refreshTokenSwagger.setData.find.one.isActive=false
refreshTokenSwagger.setData.find.one.data={
    parameter:{
        schema:findOne,
    },
}
//--------------End Find One------------------//

//--------------------------------------------------------//

//--------------Begin Update Many------------------//
//refreshTokenSwagger.setData.update.many.isActive=false
refreshTokenSwagger.setData.update.many.data={
    parameter:{
        schema:updateMany,
    },
}
//--------------End Update Many------------------//

//--------------------------------------------------------//

//--------------Begin Update One------------------//
//refreshTokenSwagger.setData.update.one.isActive=false
refreshTokenSwagger.setData.update.one.data={
    parameter:{
        schema:updateOne,
    },
}
//--------------End Update One------------------//

//--------------------------------------------------------//

//--------------Begin Delete Many------------------//
//refreshTokenSwagger.setData.delete.many.isActive=false
refreshTokenSwagger.setData.delete.many.data={
    parameter:{
        schema:deleteMany,
    },
}
//--------------End Delete Many------------------//

//--------------------------------------------------------//

//--------------Begin Delete One------------------//
//refreshTokenSwagger.setData.delete.one.isActive=false
refreshTokenSwagger.setData.delete.one.data={
    parameter:{
        schema:deleteOne,
    },
}
//--------------End Delete One------------------//

//------------End of default modification value for CRUD----------------//

export default refreshTokenSwagger.getDefaultCRUD() //return the sub-path and template