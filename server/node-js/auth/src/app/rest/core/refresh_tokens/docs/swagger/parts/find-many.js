export default {
    "type": "object",
    "properties": {
        "where": {
            "type": "object",
            "properties": {
                "token": {
                    "type": "string",
                    "example": "eyd.ghhjhjhjh.JJKJJK.hhhhhhhhhhhhg"
                },
            }
        },
        "order": {
            "type": "object",
            "properties": {
                "token": {
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
            "example": "eyuu.jhjhjgh-ghghghghg.iuiuu"
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