import { compareSync } from "bcrypt";
import { User } from "../Models/User";
var debug = require("debug")("ngrok:app");

export default async function authenticate(email, password, done) {
  if (email && password) {
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        return done(err);
      }
      debug("Login Request");
      if (!user) {
        return done(null, false);
      }
      const isMatch = compareSync(password, hash);
      if (!isMatch) {
        return done(null, false);
      }
      return done(null, user);
    });
  } else {
    return done(null, false);
  }
}
