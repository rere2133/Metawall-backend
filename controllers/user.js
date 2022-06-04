const appError = require("../services/appError");
const User = require("../models/userModel");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateJWT = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  user.password = undefined;
  res.status(statusCode).json({
    user: user.name,
    token,
  });
};

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
    password = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password,
    });

    generateJWT(newUser, 201, res);
  },
};

module.exports = userControllers;
