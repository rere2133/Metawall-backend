const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => {
  console.log("資料庫連結成功");
});

// mongoose
//   .connect("mongodb://127.0.0.1:27017/postTest")
//   .then(() => console.log("資料連結成功"))
//   .catch((err) => console.log(err));
