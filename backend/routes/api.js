const express = require("express");
const router = express.Router();
const { User } = require("../Models/User");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { EVENT_TYPES } = require("../utils/constants");
const mongoose = require("mongoose");

// Generate URL String
router.post("/createURL", isAuthenticated, async (req, res) => {
  if (
    !req.body.EventType ||
    !EVENT_TYPES.includes(req.body.EventType) ||
    !req.body.name
  ) {
    return res.send("All fields is required");
  }
  const name = req.body.name;
  const EVENT_TYPE = req.body.EventType;
  // wh/<user-id>/<event-type>/<webhook-id>
  const userId = `${req.user._id}`.slice(-6);
  const id = new mongoose.Types.ObjectId();
  const urlString =
    "wh/" + userId + "/" + EVENT_TYPE + "/" + (id + "").slice(-6);
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
    res.send(webhook);
  } else {
    res.send({});
  }
});

router.post("/deleteURL", isAuthenticated, async (req, res) => {
  const webhookId = req.body.webhookID;

  const result = await User.findByIdAndUpdate(req.user._id, {
    $pull: { webhooks: { _id: webhookId } },
  }).exec();

  if (result) {
    console.log("Deleted Webhook");
    console.log(webhookId);
    res.send("Webhook Deleted");
  } else {
    res.send("Operation Failed");
  }
});

router.get("/", function (req, res, next) {
  res.status(200).send("respond with a resource");
});

module.exports = router;
