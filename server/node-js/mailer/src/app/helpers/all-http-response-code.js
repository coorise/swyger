const HTTP_RESPONSE_CODE={
  SUCCESS_CODE:200,
  CREATED_CODE:201, //indicates that the request was successful and crete a new page (url)
  ACCEPTED_CODE:202,//indicates that the request is accepted but no been completed
  ERROR_FROM_USER_CODE:400,
  UNAUTHORIZED_CODE:401,
  ERROR_PAYMENT_CODE:402,
  FORBIDDEN_CODE:403,
  PAGE_NOT_FOUND_CODE:404,
  METHOD_NOT_ALLOWED_CODE:405, // (get, put,patch, post, delete...etc)
  INTERNAL_ERROR_CODE:500,
  NOT_IMPLEMENTED_CODE:501, // useful when you want to tell client that the function is not available yet
  MESSAGE:{
    _200:'The request is done!',
    _400:'Error from user, please check your mail api variables',
    _401:'The user is not logged in, please login first',
    _403:'The user is not authorized to do this request!',
    _404:'Sorry, but this page is not available!',
    _500:'Sorry, there is an internal error from mail server due to your request, contact the supplier!'
  }
}
export default HTTP_RESPONSE_CODE
