require("dotenv").config();
const mongoose = require("mongoose");
const createError = require("http-errors");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const comparePassword = require("./utils/comparePassword");
var debug = require("debug")("backend:server");
const sessionMiddleware = require("./middlewares/sessionMiddleware");
const { User } = require("./Models/User");

// --- Passport.js ---
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
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
      usernameField: "email",
      passwordField: "password",
    },
    comparePassword
  )
);

// Database connection
async function main() {
  await mongoose.connect(process.env.MONGO_DB_URI);
  debug("Connected to MongoDB");
}
main().catch((err) => console.log(err));

// Express app
const app = express();
app.use(cors());

// Helmet.js
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Set up middlewares for passport.js
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// General express middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    req.session.authenticated = true; // required for socket.io session
  }
  next();
});

// --- Routers ---
// const indexRouter = require("./routes/index");
const webhooksRouter = require("./routes/webhooks");
const apiRouter = require("./routes/api");
const authRouter = require("./routes/auth");
// app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/auth", authRouter);
app.use("/wh", webhooksRouter);

// Serve React app
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
