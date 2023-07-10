export default {
    "type": "object",
    "required": "true - fullName - email",
    "properties": {
        "fullName": {
            "type": "string",
            "example": "user"
        },
        "email": {
            "type": "string",
            "format": "email"
        },
        "username": {
            "type": "string"
        },
    }
}