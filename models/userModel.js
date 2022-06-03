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
    sex: {
      type: "String",
      enum: ["female", "male", ""],
      default: "",
      //字串須符合enum內的value
    },
    password: {
      type: "String",
      required: [true, "密碼尚未填寫"],
      minlength: 8,
      select: false,
    },
    photo: {
      type: String,
      default: "",
    },
    createAt: {
      type: Date,
      default: Date.now,
      // select: false,
    },
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
