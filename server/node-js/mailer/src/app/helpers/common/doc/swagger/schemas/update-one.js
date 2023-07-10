export default {
    "type": "object",
    "required": [
        "uid"
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
        "uid": {
            "type": "string",
            "format": "string",
            "example": "uid-7766555-yyyuuyy"
        }
    }
}