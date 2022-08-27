const handleSuccess = require("../services/handleSuccess");
const appError = require("../services/appError");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");
const postControllers = {
  async getPosts(req, res) {
    const timeSort = req.query.timeSort == "asc" ? "createAt" : "-createAt";
    const search =
      req.query.search !== undefined
        ? { content: new RegExp(req.query.search) }
        : {};
    const posts = await Post.find(search)
      .populate({
        path: "user",
        select: "name photo",
      })
      .populate({
        path: "comments",
        select: "comment user",
      })
      .sort(timeSort);
    await handleSuccess(res, null, posts);
  },
  async getPost(req, res, next) {
    const id = req.params.id;
    const post = await Post.find({ _id: id })
      .populate({
        path: "user",
        select: "name photo",
      })
      .populate({
        path: "comments",
        select: "comment user",
      });
    console.log({ post });
    if (post.length != 0) {
      await handleSuccess(res, null, post);
    } else {
      appError(400, "無此貼文ID", next);
    }
  },
  async createPosts(req, res, next) {
    const data = req.body;
    if (data.content) {
      await Post.create({
        user: req.user.id,
        content: data.content,
        image: data.image || "",
        tags: data.tags || [],
      });
      await handleSuccess(res, "新增成功");
    } else {
      appError(400, "欄位填寫錯誤或無此ID", next);
    }
  },
  async deleteAllPosts(req, res, next) {
    await Post.deleteMany({});
    await handleSuccess(res);
  },
  async deletePost(req, res, next) {
    const id = req.params.id;
    let deletePost = await Post.findByIdAndDelete(id);
    if (deletePost != null) {
      await handleSuccess(res, "成功刪除一筆");
    } else {
      appError(400, "無此貼文ID", next);
    }
  },
  async editPost(req, res, next) {
    const id = req.params.id;
    // console.log({ id });
    const data = req.body;
    // console.log({ data });
    if (data.content) {
      let editedPost = await Post.findByIdAndUpdate(id, {
        user: req.user.id,
        content: data.content,
        image: data.image || "",
        tags: data.tags || [],
      });
      if (editedPost !== null) {
        await handleSuccess(res, "成功更新一筆");
      } else {
        appError(400, "無此貼文ID", next);
      }
    } else {
      appError(400, "尚未填寫貼文內容", next);
    }
  },
  async addLike(req, res, next) {
    const postId = req.params.id;
    const userId = req.user.id;
    const post = await Post.findByIdAndUpdate(postId, {
      $addToSet: { likes: req.user.id },
    });
    if (post == null) {
      return appError(400, "無此貼文", next);
    }
    res.status(200).json({
      status: "success",
      postId,
      userId,
    });
  },
  async deleteLike(req, res, next) {
    const postId = req.params.id;
    const userId = req.user.id;
    const post = await Post.findByIdAndUpdate(postId, {
      $pull: { likes: req.user.id },
    });
    if (post == null) {
      return appError(400, "無此貼文", next);
    }
    res.status(200).json({
      status: "success",
      postId,
      userId,
    });
  },
  async createComment(req, res, next) {
    const post = req.params.id;
    const user = req.user.id;
    const { comment } = req.body;
    const newComment = await Comment.create({
      post,
      user,
      comment,
    });
    res.status(200).json({
      status: "success",
      res: newComment,
    });
  },
  async getUserPosts(req, res, next) {
    const user = req.params.id;
    const postList = await Post.find({ user }).populate({
      path: "user",
      select: "name photo",
    });
    populate({
      path: "comments",
      select: "comment user",
    });
    res.status(200).json({
      status: "success",
      results: postList.length,
      postList,
    });
  },
  cors(req, res, next) {
    handleSuccess(res, "options");
  },
};
module.exports = postControllers;
