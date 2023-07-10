export default {
    "type": "object",
    "required": [
        "email",
    ],
    "properties": {
        "email": {
            "type": "string",
            "format": "email",
            "example": "user@agglomy.com"
        },
    }
}