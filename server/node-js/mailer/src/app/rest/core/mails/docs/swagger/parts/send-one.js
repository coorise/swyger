import mailSchema from '../../../models/mails.schema.json'
import ParseSchema from "../../../../../../helpers/parse-schema";
let schema=ParseSchema(mailSchema.columns)
export default {
    "type": "object",
    /*"required": [
        "name",
        "description"
    ],*/
    "properties": schema
}