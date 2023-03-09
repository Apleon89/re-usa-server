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
      ref: "Users",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

const MessagesModel = model('Message', messagesSchema)

module.exports = MessagesModel