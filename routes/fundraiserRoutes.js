const express = require("express");
const {
  createFundRaiser,
  getFundraisers,
} = require("../controllers/fundraiser");

const fundRaiserRouter = express.Router();

fundRaiserRouter.post("/create-fundraiser/:id", createFundRaiser);
fundRaiserRouter.get("/fundraiser/:id", getFundraisers);

module.exports = fundRaiserRouter;
