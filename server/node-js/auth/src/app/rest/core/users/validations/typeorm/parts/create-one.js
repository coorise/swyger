import UserSchema from '../../../models/typeorm/users.schema.json'
import ParseSchema from "../../../../../../helpers/parse-schema";

let schema=ParseSchema(UserSchema.columns)

export default schema