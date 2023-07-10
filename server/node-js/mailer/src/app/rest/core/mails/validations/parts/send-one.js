import UserSchema from '../../models/mails.schema.json'
import ParseSchema from "../../../../../helpers/parse-schema";

let schema=ParseSchema(UserSchema.columns)

export default schema