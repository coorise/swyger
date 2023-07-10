//visit:https://swagger.io/docs/specification/components/
export default {
    components: {
        responses:{
            Success: {
                "description": "OK",
                "schema": {
                    "$ref": "#/components/schemas/Success"
                }
            },
            Error: {
                "description": "Bad request",
                "schema": {
                    "$ref": "#/components/schemas/Error"
                }
            },
            Unauthorized: {
                "description": "Unauthorized",
                "schema": {
                    "$ref": "#/components/schemas/Error"
                }
            },
            NotFound: {
                "description": "The specified resource was not found",
                "schema": {
                    "$ref": "#/components/schemas/Error"
                }
            }
        },
        parameters:{
            pageParam: {
                "in": "body",
                "name": "data",
                "type": "object",
                "description": "Parameter to fetch many users",
                "schema": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "object",
                            "properties": {
                                "fullName": {
                                    "type": "string",
                                    "example": "user"
                                }
                            }
                        }
                    }
                }
            }
        },
        schemas: {
            Success: {
                "type": "object",
                "required": [
                    "status",
                ],
                "properties": {
                    "status": {
                        "type": "string"
                    },
                    "data": {
                        "type": "object"
                    }
                }
            },
            Error: {
                "type": "object",
                "required": [
                    "code",
                    "message"
                ],
                "properties": {
                    "code": {
                        "type": "string"
                    },
                    "message": {
                        "type": "string"
                    }
                }
            },
            Login: {
                "type": "object",
                "properties": {
                    "token": {
                        "type": "string"
                    },
                    "user": {
                        "$ref": "#/components/definitions/User"
                    }
                }
            }

        },
    },
};