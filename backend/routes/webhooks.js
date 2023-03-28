var express = require('express');
var router = express.Router();
const { isUserConnected } = require('../socket.io/main');

// <user-id>/<event-type>/<webhook-id>
router.post('/:userId/JOIN/:webhook', (req, res) => {
  const userId = req.params.userId; // get the user id from the request params
  const webhookID = req.params.webhook;
  const socket = isUserConnected(userId); // check if the user is online or not

  if (socket && webhookID) {
    socket.emit(webhookID, req.body);
  }

  res.status(200).send();
});

router.post('/:userId/GIFT/:webhook', (req, res) => {
  const userId = req.params.userId;
  const webhookID = req.params.webhook;
  const socket = isUserConnected(userId);

  if (socket && webhookID) {
    socket.emit(webhookID, req.body);
  }

  res.status(200).send();
});

router.post('/:userId/LIKE/:webhook', (req, res) => {
  const userId = req.params.userId;
  const webhookID = req.params.webhook;
  const socket = isUserConnected(userId);

  if (socket && webhookID) {
    socket.emit(webhookID, req.body);
  }

  res.status(200).send();
});

router.post('/:userId/SHARE/:webhook', (req, res) => {
  const userId = req.params.userId;
  const webhookID = req.params.webhook;
  const socket = isUserConnected(userId);

  if (socket && webhookID) {
    socket.emit(webhookID, req.body);
  }

  res.status(200).send();
});

router.post('/:userId/FOLLOW/:webhook', (req, res) => {
  const userId = req.params.userId;
  const webhookID = req.params.webhook;
  const socket = isUserConnected(userId);

  if (socket && webhookID) {
    socket.emit(webhookID, req.body);
  }

  res.status(200).send();
});

router.post('/:userId/SUBSCRIBE/:webhook', (req, res) => {
  const userId = req.params.userId;
  const webhookID = req.params.webhook;
  const socket = isUserConnected(userId);

  if (socket && webhookID) {
    socket.emit(webhookID, req.body);
  }

  res.status(200).send();
});

router.post('/:userId/COMMENT/:webhook', (req, res) => {
  const userId = req.params.userId;
  const webhookID = req.params.webhook;
  const socket = isUserConnected(userId);

  if (socket && webhookID) {
    socket.emit(webhookID, req.body);
  }

  res.status(200).send();
});

module.exports = router;
