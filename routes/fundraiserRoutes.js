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
  upload.array("image", 10), // Accepts up to 10 images
  createFundRaiser
);
fundRaiserRouter.get("/fundraiser/:id", getFundraisers);

module.exports = fundRaiserRouter;
