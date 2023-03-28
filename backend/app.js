require('dotenv').config();
const mongoose = require('mongoose');
const createError = require('http-errors');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug')('backend:server');
const { User } = require('./Models/User');

// --- Passport.js ---
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authenticateLocal = require('./passport/authenticateLocal');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const cookieExtractor = require('./passport/cookieExtractor');
const authenticateJWT = require('./passport/authenticateJWT');

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
  const userData = await User.findById(id).exec();
  if (!userData) {
    return done(null, false);
  }
  return done(null, userData);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    authenticateLocal
  )
);

passport.use(
  'jwt',
  new JwtStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    },
    authenticateJWT
  )
);

// Database connection
async function main() {
  await mongoose.connect(process.env.MONGO_DB_URI);
  debug('Connected to MongoDB');
}
main().catch((err) => console.log(err));

// Express app
const app = express();
app.disable('x-powered-by');
app.use(cors());

// Helmet.js
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Set up middlewares for passport.js
app.use(passport.initialize());

// General express middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// --- Routers ---
const webhooksRouter = require('./routes/webhooks');
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');
const isAuthenticated = require('./middlewares/isAuthenticated');

// Serve React app
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(
  '/dashboard',
  isAuthenticated,
  express.static(path.join(__dirname, 'public'))
);
app.use(
  '/list',
  isAuthenticated,
  express.static(path.join(__dirname, 'public'))
);
app.use('/api', apiRouter);
app.use('/auth', authRouter);
app.use('/wh', webhooksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// For Browser 404
app.get('*', express.static(path.join(__dirname, 'public')));

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
