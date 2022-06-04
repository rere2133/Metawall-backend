const validator = require("validator");
const appError = require("../services/appError");
const User = require("../models/userModel");
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
      return appError(400, "密碼須大於8碼", next);
    }
    if (!validator.isEmail(email)) {
      return appError(400, "email格式錯誤", next);
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
    const { email, password } = req.body;
    if (!email || !password) {
      return appError(400, "帳號密碼不得為空", next);
    }
    const user = await User.findOne({ email }).select("+password");
    const auth = await bcrypt.compare(password, user.password);
    console.log(auth);
    if (!user || !auth) {
      return appError(400, "帳號或密碼有誤", next);
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
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return appError(400, "欄位填寫錯誤", next);
    }
    if (password !== confirmPassword) {
      return appError(400, "密碼不一致", next);
    }
    if (!validator.isLength(password, { min: 8 })) {
      return appError(400, "密碼須大於8碼", next);
    }
    newPassword = await bcrypt.hash(password, 12);
    const user = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword,
    });
    console.log(user);
    generateJWT(user, 200, res);
    // res.status(200).json({
    //   status: "patch",
    //   user: req.user,
    // });
  },
};
module.exports = userControllers;
