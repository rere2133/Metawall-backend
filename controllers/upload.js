const appError = require("../services/appError");
const sizeOf = require("image-size");
const { imgClient, default: ImgurClient } = require("imgur");
const uploadControllers = {
  async uploadImg(req, res, next) {
    if (!req.files) {
      return appError(400, "尚未上傳圖片", next);
    }
    const dimension = sizeOf(req.files[0].buffer);
    if (dimension.height !== dimension.width) {
      return appError(400, "圖片長寬比須符合1:1比例", next);
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
