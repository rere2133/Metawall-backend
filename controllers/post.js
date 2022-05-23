const handleSuccess = require("../services/handleSuccess");
const handleError = require("../services/handleError");
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
  async createPosts(req, res) {
    try {
      const data = req.body;
      console.log({ data });
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
    await Post.deleteMany({});
    await handleSuccess(res);
  },
  async deletePost(req, res) {
    const id = req.params.id;
    await Post.findByIdAndDelete(id);
    await handleSuccess(res, "成功刪除一筆");
  },
  async editPost(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
      console.log({ data });
      if (data.name && data.content) {
        let editedPost = await Post.findByIdAndUpdate(id, {
          name: data.name,
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
