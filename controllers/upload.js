const appError = require("../services/appError");
const sizeOf = require("image-size");
const { ImgurClient } = require("imgur");
// const Post = require("../models/postModel");
// const User = require("../models/userModel");
const uploadControllers = {
  async uploadImg(req, res, next) {
    console.log(req.files);
    if (!req.files || !req.files.length) {
      return appError(400, "尚未上傳圖片", next);
    }
    const dimensions = sizeOf(req.files[0].buffer);
    if (dimensions.width !== dimensions.height) {
      return appError(400, "圖片比例須為 1:1 尺寸", next);
    }
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENT_ID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });
    const response = await client.upload({
      image: req.files[0].buffer.toString("base64"),
      type: "base64",
      album: process.env.IMGUR_ALBUM_ID,
    });
    res.status(200).json({
      status: "success",
      imgUrl: response.data.link,
    });
  },
};
module.exports = uploadControllers;
