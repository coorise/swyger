import {TypeController} from '../../../../helpers/common/controller/typeorm';
import refreshTokenService from '../services/typeorm/refresh_tokens.service';


class RefreshTokenController extends TypeController {
  constructor(service, name) {
    super(service, name);
  }
}

export default new RefreshTokenController(refreshTokenService, 'RefreshToken');
