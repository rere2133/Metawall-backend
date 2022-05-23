const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "名稱尚未填寫"],
    },
    email: {
      type: String,
      required: [true, "貼文尚未填寫"],
      unique: true,
      lowercase: true,
      select: false,
    },
    photo: {
      type: String,
      default: "",
    },
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
