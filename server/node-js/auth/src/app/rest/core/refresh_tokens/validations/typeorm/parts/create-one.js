import userSchema from '../../../models/typeorm/refresh_tokens.schema.json'
import ParseSchema from "../../../../../../helpers/parse-schema";

let schema=ParseSchema(userSchema.columns)

export default schema