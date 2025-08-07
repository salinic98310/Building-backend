const Fundraiser = require("../models/Fundraiser"); // Adjust the path if needed

const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Fundraiser.find().populate("userId", "name email"); // Populate basic user details if needed
    res.status(200).json({ data: campaigns });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  getAllCampaigns,
};
