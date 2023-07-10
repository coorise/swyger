//Create many Users
const template=(data)=>{
    return {
        [data.method]: {
            "tags": data.tags,
            "description": data.description,
            "security": [
                {
                    "BearerAuth": []
                }
            ],
            "produces": [
                "application/json"
            ],
            "parameters": [
                {
                    "name": "data",
                    "description": data.parameter.description,
                    "in": "body",
                    "required": true,
                    "type": "string",
                    "schema": {
                        "type":"object",
                        "properties":{
                            "data":data.parameter?.schema
                        },

                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "OK",
                    "schema":(data.response.successSchema)?{
                        ...data.response.successSchema
                    } : {
                        $ref: '#/components/schemas/Success'
                    }
                },
                "400":{
                    "description":"Bad request",
                    "schema":(data.response.errorSchema)? {
                        ...data.response.errorSchema
                    }:{
                        $ref: '#/components/schemas/Error'
                    }
                },
                "401":{
                    "description":"Not Authorized",
                    "schema":(data.response.notAuthorizedSchema)?{
                        ...data.response.notAuthorizedSchema
                    }:{
                        $ref: '#/components/schemas/Error'
                    }
                },
                "404":{
                    "description":"Not Found",
                    "schema":(data.response.notFoundSchema) ?{
                        ...data.response.notFoundSchema
                    }:{
                        $ref: '#/components/schemas/Error'
                    }
                },
                ...data.response.otherCodes
            }
        }
    }
}
export default template