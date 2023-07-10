import builderSchema from '../../../models/schemas.type.json'
import ParseSchema from "../../../../../../helpers/parse-schema";
let schema=ParseSchema(builderSchema)
export default {
    "type": "object",
    /*"required": [
        "name",
        "description"
    ],*/
    "properties": schema
}