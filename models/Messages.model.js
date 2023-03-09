const { Schema, model } = require("mongoose");

const messagesSchema = new Schema(
  {
    message: {
      type: String,
      require: true,
      trim: true,
    },
    transmitter: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const MessagesModel = model('Message', messagesSchema)

module.exports = MessagesModel