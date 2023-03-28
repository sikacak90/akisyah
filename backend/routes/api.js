const express = require('express');
const router = express.Router();
const { User } = require('../Models/User');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { EVENT_TYPES, URL_ID_LENGTH } = require('../utils/constants');
const mongoose = require('mongoose');
const Joi = require('joi');

// Generate URL String
router.post('/createURL', isAuthenticated, async (req, res) => {
  if (
    !req.body.EventType ||
    !EVENT_TYPES.includes(req.body.EventType) ||
    !req.body.name
  ) {
    return res.status(400).json({ error: 'Invalid Event Type or Name' });
  }
  const name = req.body.name;
  const EVENT_TYPE = req.body.EventType;
  const userId = `${req.user._id}`.slice(URL_ID_LENGTH);
  const id = new mongoose.Types.ObjectId();
  // wh/<user-id>/<event-type>/<webhook-id>
  const urlString =
    'wh/' + userId + '/' + EVENT_TYPE + '/' + (id + '').slice(URL_ID_LENGTH);
  const webhook = {
    _id: id,
    name: name,
    EventType: EVENT_TYPE,
    URL: urlString,
  };

  const result = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { webhooks: webhook } }
  ).exec();

  if (result) {
    res.json(webhook);
  } else {
    res.status(500).json({ error: 'Operation Failed' });
  }
});

router.post('/deleteURL', isAuthenticated, async (req, res) => {
  const webhookId = req.body.webhookID;
  const webhookSchema = Joi.object({
    webhookID: Joi.string().required(),
  });

  const { error, value } = webhookSchema.validate({ webhookID: webhookId });

  if (error) {
    return res.status(400).json({ error: 'Invalid Webhook ID' });
  }

  const result = await User.findByIdAndUpdate(req.user._id, {
    $pull: { webhooks: { _id: value.webhookID } },
  }).exec();

  if (result) {
    console.log('Deleted Webhook');
    console.log(value.webhookID);
    res.json({ message: 'success' });
  } else {
    res.status(500).json({ error: 'Operation Failed' });
  }
});

module.exports = router;
