const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Admin", "Assistant"],
    required: true,
  },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;
