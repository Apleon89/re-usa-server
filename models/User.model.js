const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: 'https://res.cloudinary.com/dacltsvln/image/upload/v1678703493/re-Usa/ycvqs2xrodjsdigteaew.png'
    },
    favouritesAds: [
      {
        type: Schema.Types.ObjectID,
        ref: "Ad",
      },
    ],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const UserModel = model("User", userSchema);

module.exports = UserModel;
