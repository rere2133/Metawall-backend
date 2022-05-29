const handleSuccess = require("../services/handleSuccess");
const handleError = require("../services/handleError");
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
    try {
      const data = req.body;
      console.log({ data });
      if (data.content == undefined) {
        appError(400, "貼文內容為必填", next);
      }
      if (data.user && data.content) {
        await Post.create({
          user: data.user,
          content: data.content,
          image: data.image || "",
          tags: data.tags || [],
        });
        await handleSuccess(res, "新增成功");
      } else {
        handleError(res);
      }
    } catch (err) {
      handleError(res, 400, err.message);
    }
  },
  async deleteAllPosts(req, res) {
    try {
      await Post.deleteMany({});
      await handleSuccess(res);
    } catch {
      handleError(res);
    }
  },
  async deletePost(req, res) {
    try {
      // console.log(req.originalUrl);
      const id = req.params.id;
      let deletePost = await Post.findByIdAndDelete(id);
      if (deletePost != null) {
        await handleSuccess(res, "成功刪除一筆");
      } else {
        handleError(res);
      }
    } catch (err) {
      handleError(res);
    }
  },
  async editPost(req, res) {
    try {
      const id = req.params.id;
      console.log({ id });
      const data = req.body;
      console.log({ data });
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
          handleError(res);
        }
      } else {
        handleError(res);
      }
    } catch (err) {
      handleError(res, 400, err.message);
    }
  },
  cors(req, res) {
    handleSuccess(res, "options");
  },
};
module.exports = postControllers;
