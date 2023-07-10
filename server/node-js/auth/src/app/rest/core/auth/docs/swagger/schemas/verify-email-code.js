export default {
    "type": "object",
    "required": [
        "email",
        "code"
    ],
    "properties": {
        "email": {
            "type": "string",
            "format": "email",
            "example": "user@agglomy.com"
        },
        "code": {
            "type": "string",
            "example": "123456"
        }
    }
}