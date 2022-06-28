const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "貼文 id 未填寫"],
    },
    content: {
      type: String,
      required: [true, "貼文尚未填寫"],
    },
    image: {
      type: String,
      default: "",
    },
    tags: [
      {
        type: String,
        default: "",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "user",
      },
    ],
    createAt: {
      type: Date,
      default: Date.now,
      // select: false,
    },
  },
  {
    versionKey: false,
    id: false,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
postSchema.virtual("comments", {
  ref: "comment",
  localField: "_id",
  foreignField: "post",
});
const Post = mongoose.model("post", postSchema);
module.exports = Post;
