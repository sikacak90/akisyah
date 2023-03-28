const { JWT_COOKIE_NAME } = require('../utils/constants');

module.exports = (req) => {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies[JWT_COOKIE_NAME];
  }
  return token;
};
