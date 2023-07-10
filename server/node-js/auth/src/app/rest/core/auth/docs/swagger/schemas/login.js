export default {
    "type": "object",
    "required": [
        "email",
        "password"
    ],
    "properties": {
        "email": {
            "type": "string",
            "format": "email",
            "example": "user@agglomy.com"
        },
        "password": {
            "type": "string",
            "format": "password"
        }
    }
}