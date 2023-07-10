export default {
    "type": "object",
    "required": [
        "fullName",
        "email",
        "password"
    ],
    "properties": {
        "fullName": {
            "type": "string",
            "example": "user"
        },
        "email": {
            "type": "string",
            "format": "email"
        },
        "password": {
            "type": "string",
            "format": "password"
        }
    }
}