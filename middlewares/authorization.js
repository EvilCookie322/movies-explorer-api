const jwt = require('jsonwebtoken');
const AuthorizationError = require('../custom_errors/AuthorizationError');
const { NODE_ENV, JWT_SECRET, DEV_JWT } = require('../constants/env');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return next(new AuthorizationError('Необходима авторизация'));
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT);
  } catch (err) {
    return next(new AuthorizationError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
