import UserSchema from '../../../models/typeorm/data.schema.json'
import ParseSchema from "../../../../../../helpers/parse-schema";

let schema=ParseSchema(UserSchema.columns)

export default schema