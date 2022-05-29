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

//程式出現重大錯誤時
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

app.use(postsRouter);

app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "找不到此頁面",
  });
});
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    status: "error",
    message: err.message,
  });
});
//未捕捉到的catch
process.on("unhandledRejection", (err, promise) => {
  console.error("未捕捉到的rejection:", promise, "原因：", err);
});

module.exports = app;
