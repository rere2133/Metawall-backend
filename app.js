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

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use((err, req, res, next) => {
  handleError(res, 400, err.message);
});
app.use((req, res, next) => {
  handleError(res, 404, "page not found.");
});

module.exports = app;
