const express = require("express");
const passport = require("passport");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../Models/User");
const { io } = require("../socket.io/main");

router.get("/isAuth", async (req, res) => {
  if (req.isAuthenticated()) {
    const resData = req.user;
    resData["password"] = undefined;
    return res.json({ user: resData });
  } else {
    return res.json({ user: false });
  }
});

// Tested
router.post("/login", (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.send("Please enter all fields.");
  return passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/dashboard",
  })(req, res);
});

// Tested
router.post("/signup", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.send("Please enter all the fields");
  }
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const newUser = new User({
    email: req.body.email,
    password: hash,
  });
  try {
    const result = await newUser.save();
    if (result) {
      res.redirect("/");
    } else {
      res.status(500).send("User Creation Failed");
    }
  } catch {
    res.status(500).send("User Creation Failed");
  }
});

// Tested
router.get("/logout", (req, res) => {
  const sessionId = req.session.id;
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      // disconnect all Socket.IO connections linked to this session ID
      io.in(sessionId).disconnectSockets();
    });
  });
  res.redirect("/");
});

module.exports = router;
