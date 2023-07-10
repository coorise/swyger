import authSchema from '../../../models/typeorm/auth.type.json'
import ParseSchema from "../../../../../../helpers/parse-schema";

let schema=ParseSchema(authSchema.columns)

export default schema