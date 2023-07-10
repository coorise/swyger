import fileSchema from '../../../models/typeorm/files.schema.json'
import ParseSchema from "../../../../../../helpers/parse-schema";
let schema=ParseSchema(fileSchema.columns)
export default {
    "type": "object",
    /*"required": [
        "name",
        "description"
    ],*/
    "properties": schema
}