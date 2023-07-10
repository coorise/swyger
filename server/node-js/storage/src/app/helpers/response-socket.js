// https://github.com/cryptlex/rest-api-response-format
import HTTP_RESPONSE_CODE from "./all-http-response-code";

export default class SocketResponse {
  static success(data, status = HTTP_RESPONSE_CODE.SUCCESS_CODE) {
    return {
      status: 'success',
      code:status,
      ...data
    };
  }

  static error(error, status = HTTP_RESPONSE_CODE.FORBIDDEN_CODE) {
    return {
      success: 'failed',
      ...error
    };
  }
}
