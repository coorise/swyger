import jwt from 'jsonwebtoken';

export const sign_cmd = (data={},config={} )=> {
  let option={}
  if(config.expires) option.expiresIn=config.expires
  const token = jwt.sign(data, config.secret||process.env.JWT_SECRET, option);
  return token;
};

export const sign = data => {
  const token = jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });
  return token;
};

export const verify = token => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET,
    { ignoreExpiration: false },
  );
};


export const refreshSign = data => {
  return jwt.sign(data, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES
  });
};
export const refreshVerify = token => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET,{ ignoreExpiration: false });
};


export const getToken = req => {
  let authorization = null;
  let token = null;
  if (req.query && req.query.token) {
    return req.query.token;
  } else if (req.authorization) {
    authorization = req.authorization;
  } else if (req.headers) {
    authorization = req.headers.authorization;
  } else if (req.socket) {
    if (req.socket.handshake.query && req.socket.handshake.query.token) {
      return req.socket.handshake.query.token;
    }
    authorization = req.socket.handshake.headers.authorization;
  }
  if (authorization) {
    const tokens = authorization.split('Bearer ');
    if (Array.isArray(tokens) || tokens.length === 2) {
      token = tokens[1];
    }
  }
  return token;
};

export default {
  sign,
  sign_cmd,
  verify,
  getToken,
  refreshSign,
  refreshVerify
};
