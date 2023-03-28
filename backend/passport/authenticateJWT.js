const { User } = require('../Models/User');

module.exports = async (payload, done) => {
  const now = Date.now() / 1000;
  if (payload.exp < now) {
    return done(null, false);
  }

  try {
    const user = await User.findById(payload.userId).exec();

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
};
