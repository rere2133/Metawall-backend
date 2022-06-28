const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "post",
      required: [true, "comment must belong to post"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "user must belong to post"],
    },
    comment: {
      type: String,
      required: [true, "留言內容不得為空"],
    },
    createAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  {
    versionKey: false,
  }
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo id",
  });
  next();
});

const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;
