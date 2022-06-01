var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

// var usersRouter = require("./routes/users");
var postsRouter = require("./routes/posts");

var app = express();

require("./connections");
const handleError = require("./services/handleError");
const res = require("express/lib/response");

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception");
  console.log(err);
  process.exit(1);
});

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/users", usersRouter);
app.use(postsRouter);

app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "找不到頁面！",
  });
});

const resDevError = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    err: err,
    stack: err.stack,
  });
};
const resProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  } else {
    res.status(500).json({
      message: "發生錯誤，請稍後再試",
    });
  }
};
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  //dev
  if (process.env.NODE_ENV == "dev") {
    return resDevError(err, res);
  }
  //prod
  if (err.name == "ValidationError") {
    err.message = "欄位未填寫正確，請重新輸入";
    err.isOperational = true;
    return resProdError(err, res);
  }
  resProdError(err, res);
});

process.on("unhandledRejection", (err, promise) => {
  console.log("未捕捉到的Rejection:", promise);
  console.log("原因:" + err);
});
module.exports = app;
