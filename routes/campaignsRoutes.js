const express = require("express");
const { getAllCampaigns } = require("../controllers/campaign");
const CampaignRouter = express.Router();

CampaignRouter.get("/", getAllCampaigns);

module.exports = CampaignRouter;
