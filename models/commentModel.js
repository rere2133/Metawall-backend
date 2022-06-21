const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    require: [true, "user id 為必填"],
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: "post",
    require: [true, "留言必須有相對應貼文"],
  },
  comment: {
    type: String,
    require: [true, "留言不得為空白"],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name id photo",
  });
  next();
});

const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;
