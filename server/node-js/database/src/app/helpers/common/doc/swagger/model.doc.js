import template from './template.doc'
const dataDefault={
    method:null,
    tags:null,
    description:null,
    parameter:{
        description:null,
        schema:null,
    },
    response:{
        successSchema:null,
        errorSchema:null,
        notAuthorizedSchema:null,
        notFoundSchema:null,
        otherCodes:{}
    }

}


export default class DocModelRoute{
    parentPath
    constructor(parentPath) {
        this.parentPath=parentPath
    }
    data=dataDefault
    route=[]

    setData={
        create:{
            many:{
                isActive:true,
                data:{}
            },
            one:{
                isActive:true,
                data:{}
            }
        },
        find:{
            many:{
                isActive:true,
                data:{}
            },
            one:{
                isActive:true,
                data:{}
            }

        },
        update:{
            many:{
                isActive:true,
                data:{}
            },
            one:{
                isActive:true,
                data:{}
            }
        },
        delete:{
            many:{
                isActive:true,
                data:{}
            },
            one:{
                isActive:true,
                data:{}
            }
        },
        custom:[]
    }

    setCreateOne(data=this.setData.create.one.data){
        let path
        if(!data.path){
            path=this.parentPath+'/create-one'
        } else{
            path=data.path
        }
        let defaultValue={
            method:'post',
            tags:[
                this.parentPath
            ],
            description:'Create one item',
            parameter:{
                description:'Param has object item{}',
                schema:null,
            },
            response:{
                successSchema:null,
                errorSchema:null,
                notAuthorizedSchema:null,
            }

        }

        defaultValue= Object.assign(
            defaultValue,
            data

        )

        const generateTemplate=template(defaultValue)
        this.route.push({
            [path]:generateTemplate
        })
    }
    setCreateMany(data=this.setData.create.many.data){
        let path
        if(!data.path){
            path=this.parentPath+'/create-many'
        } else{
            path=data.path
        }
        let defaultValue={
            method:'post',
            tags:[
                this.parentPath
            ],
            description:'Create many items',
            parameter:{
                description:'Param has items in array[item,item2,...]',
                schema:{
                    "type": "array",
                    "items":{
                        ...this.setData.create.one.data?.parameter?.schema
                    }

                },
            },
            response:{
                successSchema:null,
                errorSchema:null,
                notAuthorizedSchema:null,
            }

        }

        defaultValue= Object.assign(
            defaultValue,
            data

        )


        const generateTemplate=template(defaultValue)
        this.route.push({
            [path]:generateTemplate
        })


    }
    setFindMany(data=this.setData.find.many.data){
        let path
        if(!data.path){
            path=this.parentPath+'/find-many'
        } else{
            path=data.path
        }
        let defaultValue={
            method:'post',
            tags:[
                this.parentPath
            ],
            description:'Find many items',
            parameter:{
                description:'Param has object item{}',
                schema:{
                    "type": "object",
                    "properties": {
                        "where": {
                            ...this.setData.create.one.data?.parameter?.schema
                        },
                        "order": {
                            "type": "object",
                            "properties": {
                                "fullName": {
                                    "type": "string",
                                    "example": "ASC"
                                }
                            }
                        },
                        "select": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            },
                            "example": "fullName,email"
                        },
                        "skip": {
                            "type": "integer",
                            "example": 5
                        },
                        "take": {
                            "type": "integer",
                            "example": 15
                        }
                    }
                },
            },
            response:{
                successSchema:null,
                errorSchema:null,
                notAuthorizedSchema:null,
            }

        }

        defaultValue= Object.assign(
            defaultValue,
            data

        )

        const generateTemplate=template(defaultValue)
        this.route.push({
            [path]:generateTemplate
        })

    }
    setFindOne(data=this.setData.find.one.data){
        let path
        if(!data.path){
            path=this.parentPath+'/find-one'
        } else{
            path=data.path
        }
        let defaultValue={
            method:'post',
            tags:[
                this.parentPath
            ],
            description:'Find one item',
            parameter:{
                description:'Param has object item{}',
                schema:{
                    ...this.setData.create.one.data?.parameter?.schema
                },
            },
            response:{
                successSchema:null,
                errorSchema:null,
                notAuthorizedSchema:null,
            }

        }

        defaultValue= Object.assign(
            defaultValue,
            data

        )

        const generateTemplate=template(defaultValue)
        this.route.push({
            [path]:generateTemplate
        })
    }
    setUpdateMany(data=this.setData.update.many.data){
        let path
        if(!data.path){
            path=this.parentPath+'/update-many'
        } else{
            path=data.path
        }
        let defaultValue={
            method:'put',
            tags:[
                this.parentPath
            ],
            description:'Update many items',
            parameter:{
                description:'Param has items in array[item,item2,...]',
                schema:{
                    "type":"array",
                    "items":{
                        ...this.setData.create.one.data?.parameter?.schema
                    }
                },
            },
            response:{
                successSchema:null,
                errorSchema:null,
                notAuthorizedSchema:null,
            }

        }

        defaultValue= Object.assign(
            defaultValue,
            data

        )

        const generateTemplate=template(defaultValue)
        this.route.push({
            [path]:generateTemplate
        })
    }
    setUpdateOne(data=this.setData.update.one.data){
        let path
        if(!data.path){
            path=this.parentPath+'/update-one'
        } else{
            path=data.path
        }
        let defaultValue={
            method:'put',
            tags:[
                this.parentPath
            ],
            description:'Update one item',
            parameter:{
                description:'Param has object item{}',
                schema:{
                    "required": [
                        "uid"
                    ],
                    ...this.setData.create.one.data?.parameter?.schema
                },
            },
            response:{
                successSchema:null,
                errorSchema:null,
                notAuthorizedSchema:null,
            }

        }

        defaultValue= Object.assign(
            defaultValue,
            data

        )

        const generateTemplate=template(defaultValue)
        this.route.push({
            [path]:generateTemplate
        })
    }
    setDeleteMany(data=this.setData.delete.many.data){
        let path
        if(!data.path){
            path=this.parentPath+'/delete-many'
        } else{
            path=data.path
        }
        let defaultValue={
            method:'delete',
            tags:[
                this.parentPath
            ],
            description:'Delete many items',
            parameter:{
                description:'Param has items in array[item,item2,...]',
                schema:{
                    "type":"array",
                    "items":{
                        "type":"object",
                        "properties":{
                            "uid": {
                                "type": "string",
                                "example": "uid-gjhjhjhjhjh-yuyuyuy.iuiuuu"
                            },
                        }

                    }
                },
            },
            response:{
                successSchema:null,
                errorSchema:null,
                notAuthorizedSchema:null,
            }

        }

        defaultValue= Object.assign(
            defaultValue,
            data

        )

        const generateTemplate=template(defaultValue)
        this.route.push({
            [path]:generateTemplate
        })
    }
    setDeleteOne(data=this.setData.delete.one.data){
        let path
        if(!data.path){
            path=this.parentPath+'/delete-one'
        } else{
            path=data.path
        }
        let defaultValue={
            method:'delete',
            tags:[
                this.parentPath
            ],
            description:'Delete many items',
            parameter:{
                description:'Param has object item{}',
                schema:{
                    "type":"object",
                    "properties":{
                        "uid": {
                            "type": "string",
                            "example": "uid-gjhjhjhjhjh-yuyuyuy.iuiuuu"
                        },
                    }

                },
            },
            response:{
                successSchema:null,
                errorSchema:null,
                notAuthorizedSchema:null,
            }

        }

        defaultValue= Object.assign(
            defaultValue,
            data

        )
        const generateTemplate=template(defaultValue)
        this.route.push({
            [path]:generateTemplate
        })
    }

    setCustomRoutes(routes=this.setData.custom){
        routes.forEach(route=>{
            if(route)
                this.route.push({
                    [route.path]:{...route.template}
                })
        })
    }
    init=1
    setCustomDefaultRoutes(datas=this.setData.custom){
        datas.forEach(data=>{
            let path
            if(this.parentPath && !data.childPath){
                path=this.parentPath+'/item'+this.init
                this.init++
            } else{
                path=(data.path)?data.path:this.parentPath+data.childPath
            }
            let defaultValue={
                method:'post',
                tags:[
                    this.parentPath
                ],
                description:'Description of your item',
                parameter:{
                    description:'Param for your item',
                    schema:null,
                },
                response:{
                    successSchema:null,
                    errorSchema:null,
                    notAuthorizedSchema:null,
                }

            }

            defaultValue= Object.assign(
                defaultValue,
                data

            )


            const generateTemplate=template(defaultValue)
            this.route.push({
                [path]:generateTemplate
            })
        })
    }


    getDefaultCRUD(){
        let defineRoute={}
        if(this.setData.create.one.isActive){

            this.setCreateOne()
        }

        if(this.setData.create.many.isActive){
            this.setCreateMany()
        }

        if(this.setData.find.many.isActive){
            this.setFindMany()
        }

        if(this.setData.find.one.isActive){
            this.setFindOne()
        }

        if(this.setData.update.many.isActive){
            this.setUpdateMany()
        }

        if(this.setData.update.one.isActive){
            this.setUpdateOne()
        }

        if(this.setData.delete.many.isActive){
            this.setDeleteMany()
        }

        if(this.setData.delete.one.isActive){
            this.setDeleteOne()
        }


        this.route.forEach(path=>{
            defineRoute={
                ...defineRoute,
                ...path
            }
        })

        return defineRoute
    }
    getAllRoutes(){
        let defineRoute={}
        this.setCreateOne()
        this.setCreateMany()
        this.setFindMany()
        this.setFindOne()
        this.setUpdateMany()
        this.setUpdateOne()
        this.setDeleteMany()
        this.setDeleteOne()
        this.setCustomRoutes()
        this.route.forEach(path=>{
            defineRoute={
                ...defineRoute,
                ...path
            }
        })

        return defineRoute
    }
    getCustomRoutes(){
        let defineRoute={}
        this.setCustomRoutes()
        this.route.forEach(path=>{
            defineRoute={
                ...defineRoute,
                ...path
            }
        })

        return defineRoute
    }
    getCustomDefaultRoutes(){
        let defineRoute={}
        this.setCustomDefaultRoutes()
        this.route.forEach(path=>{
            defineRoute={
                ...defineRoute,
                ...path
            }
        })

        return defineRoute
    }


}