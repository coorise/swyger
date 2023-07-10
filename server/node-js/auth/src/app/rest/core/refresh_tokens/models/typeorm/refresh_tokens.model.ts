// @ts-ignore
import TypeModel from "@common/model/typeorm/types.model";
import { decorate } from 'ts-mixer';

export default class TokenModel extends TypeModel{
  constructor() {
    super();
  }

  user_uid: string;

  isPrimaryToken: boolean;

  isTokenVerified: boolean;

  token: string;

  user_agent: string;

  expires: number;

  createdByIp: string;

  revokedByIp: string;

  previousToken: string;

  isExpired=()=>{
    return Date.now() >= this.expires;
  }

  tokenCode:number;

  tokenCodeExpires:number;
}
