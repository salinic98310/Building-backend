const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadToCloudinary = async (file) => {
  if (!file) {
    throw new Error("No file provided");
  }
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error("Cloudinary configuration is missing");
  }
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "fundraisers",
    });
    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Cloudinary upload failed");
  }
};

module.exports = { uploadToCloudinary };