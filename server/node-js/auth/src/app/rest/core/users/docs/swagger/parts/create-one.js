import userSchema from '../../../models/typeorm/users.schema.json'
import ParseSchema from "../../../../../../helpers/parse-schema";
let schema=ParseSchema(userSchema.columns)
export default {
    "type": "object",
    /*"required": [
        "name",
        "description"
    ],*/
    "properties": schema
}