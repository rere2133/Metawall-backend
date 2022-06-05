const appError = require("../services/appError");
const User = require("../models/userModel");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../services/auth");

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
  async editPassword(req, res, next) {
    let { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return appError(400, "新密碼與確認密碼不可為空", next);
    }
    if (password !== confirmPassword) {
      return appError(400, "密碼不一致", next);
    }
    if (!validator.isLength(password, { min: 8 })) {
      return appError(400, "密碼最少需要8個英文字母", next);
    }
    newPassword = await bcrypt.hash(password, 12);
    const user = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword,
    });

    generateJWT(user, 200, res);
  },
};

module.exports = userControllers;
