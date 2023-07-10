// https://github.com/cryptlex/rest-api-response-format
import HTTP_RESPONSE_CODE from "./all-http-response-code";

export default class Response {
  static success(res, data, status = HTTP_RESPONSE_CODE.SUCCESS_CODE) {
    res.status(status);
    if (data && data.docs) {
      return res.send({
        status: 'success',
        data: data.docs,
        total: data.totalDocs,
        limit: data.limit,
        page: data.page,
        pages: data.totalPages
      });
    }
    if (!res.headersSent)
    return res.send({
      status: 'success',
      code:status,
      ...data
    });
  }

  static error(res, error, status = HTTP_RESPONSE_CODE.FORBIDDEN_CODE) {
    res.status(status);
    if (!res.headersSent)
    return res.send({
      success: 'failed',
      ...error
    });
  }
}
