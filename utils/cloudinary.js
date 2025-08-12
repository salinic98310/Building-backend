const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "dhieheffr",
  api_key: process.env.API_KEY || "493932859667533",
  api_secret:
    process.env.API_SECRET || "3Ys0Ez0iqMnhta4ntMX-IOx2Cmc",
});

const uploadToCloudinary = async (file) => {
  console.log("cloudinary connected" );
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file[0].path, (err, result) => {
      fs.unlinkSync(file[0].path); // remove local file after upload
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = { uploadToCloudinary };
