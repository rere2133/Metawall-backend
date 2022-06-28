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
    password: {
      type: String,
      required: [true, "請輸入密碼"],
      minlength: 8,
      select: false,
    },
    sex: {
      type: String,
      enum: ["female", "male", ""],
      default: "",
    },
    photo: {
      type: String,
      default: "",
    },
    createAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    following: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "user",
        },
        createAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    followers: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "user",
        },
        createAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
