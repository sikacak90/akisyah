const bcrypt = require("bcrypt");
const { User } = require("../Models/User");

module.exports = async (email, password, done) => {
  try {
    if (email && password) {
      // TODO: data sanitization
      const user = await User.findOne({ email: email }).exec();
      if (!user) {
        console.log("somethings wrong");
        return done(null, false);
      }
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return done(null, false);
      }
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err);
  }
};
