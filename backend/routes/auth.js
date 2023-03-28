const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../Models/User');
const { isUserConnected } = require('../socket.io/main');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const isAuthenticated = require('../middlewares/isAuthenticated');
const {
  MIN_PASSWORD_LENGTH,
  URL_ID_LENGTH,
  JWT_EXP_TIME,
  JWT_REMEMBER_ME_EXP_TIME,
  JWT_COOKIE_NAME,
} = require('../utils/constants');

router.get('/user', isAuthenticated, (req, res) => {
  if (req.user) {
    const userData = req.user;
    userData['password'] = undefined;
    return res.json({ user: userData });
  }
  res.clearCookie(JWT_COOKIE_NAME);
  res.json({ error: 'Not authenticated.' });
});

router.post(
  '/login',
  passport.authenticate('local', {
    session: false,
  }),
  (req, res) => {
    const { rememberMe } = req.body;
    const schema = Joi.object({
      rememberMe: Joi.boolean().required(),
    });
    const { error, value } = schema.validate({ rememberMe });
    if (error) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const tokenExp = value.rememberMe ? JWT_REMEMBER_ME_EXP_TIME : JWT_EXP_TIME;

    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: tokenExp,
    });
    res.cookie(JWT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({ token });
  }
);

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  const signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().trim().min(MIN_PASSWORD_LENGTH).required(),
  });

  const { error, value } = signUpSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(value.password, salt);
  const newUser = new User({
    email: value.email,
    password: hash,
  });

  try {
    const result = await newUser.save();
    if (result) {
      result['password'] = undefined;
      res.json(result);
    } else {
      res.status(400).json({ error: 'Something went wrong.' });
    }
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email already exists.' });
    }
    res.status(400).json({ error: err });
  }
});

router.post('/logout', isAuthenticated, (req, res) => {
  const socket = isUserConnected(`${req.user._id}`.slice(URL_ID_LENGTH));
  if (socket) {
    socket.disconnect();
  }
  res.clearCookie(JWT_COOKIE_NAME);
  res.json({ message: 'Logged out successfully.' });
});

module.exports = router;
