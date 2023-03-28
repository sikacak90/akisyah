const bcrypt = require('bcrypt');
const Joi = require('joi');
const { User } = require('../Models/User');
const { MIN_PASSWORD_LENGTH } = require('../utils/constants');

module.exports = async (email, password, done) => {
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().trim().min(MIN_PASSWORD_LENGTH),
  });
  const userData = { email, password };
  const { error, value } = loginSchema.validate(userData);
  if (error) {
    return done(null, false);
  }

  try {
    if (email && password) {
      const user = await User.findOne({ email: value.email }).exec();
      if (!user) {
        return done(null, false);
      }
      const isMatch = bcrypt.compareSync(value.password, user.password);
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
