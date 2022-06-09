const handleSuccess = require("../services/handleSuccess");
const appError = require("../services/appError");
const Post = require("../models/postModel");
const User = require("../models/userModel");
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
      .sort(timeSort);
    await handleSuccess(res, null, posts);
  },
  async createPosts(req, res, next) {
    const data = req.body;
    // console.log({ data });
    if (data.user && data.content) {
      await Post.create({
        user: data.user,
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
    if (data.user && data.content) {
      let editedPost = await Post.findByIdAndUpdate(id, {
        user: data.user,
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
    const _id = req.params.id;
    const post = await Post.findByIdAndUpdate(
      { _id },
      { $addToSet: { likes: req.user.id } }
    );
    if (post == null) {
      return appError(400, "無此貼文", next);
    }
    res.status(200).json({
      status: "success",
      post_id: _id,
      user_id: req.user.id,
    });
  },
  cors(req, res, next) {
    handleSuccess(res, "options");
  },
};
module.exports = postControllers;
