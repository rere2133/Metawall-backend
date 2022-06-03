const validator = require("validator");
const jwt = require("jsonwebtoken");
const appError = require("../services/appError");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs/dist/bcrypt");
const bcryptjs = require("bcryptjs");

const generateJWT = (user, statusCode, res) => {
  //產生 JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  user.password = null;
  res.status(statusCode).json({
    name: user.name,
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
    const auth = await bcryptjs.compare(password, user.password);
    console.log(auth);
    if (!user || !auth) {
      return appError(400, "帳號或密碼有誤", next);
    }

    generateJWT(user, 200, res);
  },
};
module.exports = userControllers;
