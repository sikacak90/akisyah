const mongoose = require("mongoose");

const WebhookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  EventType: {
    type: String,
    enum: ["GIFT", "LIKE", "SHARE", "FOLLOW", "SUBSCRIBE", "COMMENT"],
    required: true,
  },
  URL: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  // username: { type: String, length: 20, required: true, unique: true },
  email: { type: String, length: 50, required: true, unique: true },
  password: { type: String, required: true },
  webhooks: { type: [WebhookSchema], default: [] },
});

const User = mongoose.model("User", UserSchema);

module.exports = {
  User: User,
};
