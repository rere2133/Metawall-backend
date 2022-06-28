const appError = require("../services/appError");
const User = require("../models/userModel");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../services/auth");
const Post = require("../models/postModel");

const userControllers = {
  async signUp(req, res, next) {
    let { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return appError(400, "欄位填寫錯誤", next);
    }
    if (password !== confirmPassword) {
      return appError(400, "密碼不一致", next);
    }
    if (!validator.isLength(password, { min: 8 })) {
      return appError(400, "密碼最少需要8個英文字母", next);
    }
    if (!validator.isEmail(email)) {
      return appError(400, "信箱格式錯誤", next);
    }
    const isExit = await User.findOne({ email });
    if (isExit) {
      return appError(400, "此信箱已被註冊", next);
    }
    password = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password,
    });

    generateJWT(newUser, 201, res);
  },
  async signIn(req, res, next) {
    let { email, password } = req.body;
    if (!email || !password) {
      return appError(400, "帳號或密碼不可為空", next);
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return appError(400, "帳號或密碼錯誤", next);
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return appError(400, "帳號或密碼錯誤", next);
    }
    generateJWT(user, 200, res);
  },
  async getProfile(req, res, next) {
    res.status(200).json({
      status: "success",
      user: req.user,
    });
  },
  async editProfile(req, res, next) {
    let { name, sex, photo } = req.body;
    const userId = req.user._id;
    if (!name) {
      return appError(400, "暱稱不可為空", next);
    }
    if (!["female", "male", ""].includes(sex)) {
      return appError(400, "性別設定錯誤", next);
    }
    let updateUser = await User.findByIdAndUpdate(userId, {
      name,
      sex,
      photo,
    });
    if (updateUser !== null) {
      res.status(200).json({
        status: "success",
        msg: "個人資料修改成功",
      });
    } else {
      appError(400, "無此使用者Id", next);
    }
  },
  async editPassword(req, res, next) {
    let { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return appError(400, "新密碼與確認密碼不可為空", next);
    }
    if (password !== confirmPassword) {
      return appError(400, "密碼不一致", next);
    }
    if (!validator.isLength(password, { min: 8 })) {
      return appError(400, "密碼最少需要8個英文字母或數字", next);
    }
    newPassword = await bcrypt.hash(password, 12);
    const user = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword,
    });

    generateJWT(user, 200, res);
  },
  async getLikeList(req, res, next) {
    const postList = await Post.find({
      likes: { $in: [req.user.id] },
    }).populate({
      path: "user",
      select: "name _id",
    });
    res.status(200).json({
      status: "success",
      postList,
    });
  },
  async followFriend(req, res, next) {
    const userId = req.user.id;
    const followId = req.params.id;
    if (userId == followId) {
      return appError(400, "您無法追蹤自己", next);
    }
    const isFollowed = await User.findOne({
      _id: userId,
      "following.user": { $eq: followId },
    });
    if (isFollowed) {
      return appError(400, "您已經追蹤此好友", next);
    }
    await User.updateOne(
      {
        _id: userId,
        "following.user": { $ne: followId },
      },
      {
        $addToSet: {
          following: {
            user: followId,
          },
        },
      }
    );
    await User.updateOne(
      {
        _id: followId,
        "followers.user": { $ne: userId },
      },
      {
        $addToSet: { followers: { user: userId } },
      }
    );
    res.status(200).json({
      status: "success",
      msg: "您已成功追蹤",
    });
  },
  async unfollowFriend(req, res, next) {
    const userId = req.user.id;
    const followId = req.params.id;
    if (userId == followId) {
      return appError(400, "您無法取消追蹤自己", next);
    }
    const notFollowed = await User.findOne({
      _id: userId,
      "following.user": { $ne: followId },
    });
    if (notFollowed) {
      return appError(400, "您尚未追蹤此好友", next);
    }
    await User.updateOne(
      {
        _id: userId,
      },
      {
        $pull: {
          following: {
            user: followId,
          },
        },
      }
    );
    await User.updateOne(
      {
        _id: followId,
      },
      {
        $pull: {
          followers: {
            user: userId,
          },
        },
      }
    );
    res.status(200).json({
      status: "success",
      msg: "您已成功取消追蹤",
    });
  },
};

module.exports = userControllers;
