export default {
    "type": "object",
    "properties": {
        "query": {
            "type": "object",
            "properties": {
                "fullName": {
                    "type": "string",
                    "example": "user"
                },
                "email": {
                    "type": "string",
                    "example": "user@gmail.com"
                }
            }
        },
        "option": {
            "type": "object",
            "properties": {
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
        }
    }
}