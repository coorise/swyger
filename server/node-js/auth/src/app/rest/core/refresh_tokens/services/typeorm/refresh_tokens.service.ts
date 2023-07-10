import refreshTokenSchema from '../../models/typeorm/refresh_tokens.schema.json';

// @ts-ignore
import {TypeService} from "@common/service/typeorm";
class RefreshTokenService extends TypeService{
  /*constructor() {
    super();

  }
*/
}
// @ts-ignore
export default new RefreshTokenService(refreshTokenSchema.name);
