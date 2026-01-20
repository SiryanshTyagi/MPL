require("dotenv").config();
const cloudinary = require("cloudinary");
const CloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mpl_players",
    allowed_formats: ["jpg", "png", "jpeg"],
    resource_type: "auto",
  },
});

module.exports = { cloudinary, storage };
