/*export const loginWithApple = async (req, res, next) => {
  try {
    const { access_token } = req.body

    let result = await authService.loginWithApple(access_token)

    return Response.success(res, result)
  } catch (e) {
    next(e)
  }
};*/