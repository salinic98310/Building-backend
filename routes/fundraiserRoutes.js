const express = require("express");
const multer = require("multer");
const {
  createFundRaiser,
  getFundraisers,
} = require("../controllers/fundraiser");
const storage = multer.diskStorage({});
const upload = multer({ storage });

const fundRaiserRouter = express.Router();

fundRaiserRouter.post(
  "/create-fundraiser/:id",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "promoVideo", maxCount: 1 },
    { name: "promoPoster", maxCount: 1 },
    { name: "license", maxCount: 1 },
    { name: "kyc", maxCount: 1 },
    { name: "pan", maxCount: 1 }
  ]), // Accepts up to 10 images
  createFundRaiser
);
fundRaiserRouter.get("/fundraiser/:id", getFundraisers);

module.exports = fundRaiserRouter;
