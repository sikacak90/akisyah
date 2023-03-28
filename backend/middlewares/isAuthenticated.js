const passport = require('passport');

module.exports = function isAuthenticated(req, res, next) {
  return passport.authenticate('jwt', { session: false })(req, res, next);
};
