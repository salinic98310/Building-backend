const Fundraiser = require("../models/Fundraiser");

const createFundRaiser = async (req, res) => {
  try {
    const { id } = req.params; // Assuming user is set in req.user by auth middleware
    console.log("userId", id);
    if (!id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const fundraiserData = { ...req.body, userId: id };

    const newFundraiser = new Fundraiser(fundraiserData);
    await newFundraiser.save();

    res.status(201).json({
      message: "Fundraiser created successfully",
      fundraiser: newFundraiser,
    });
  } catch (error) {
    console.error("Error creating fundraiser:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getFundraisers = async (req, res) => {
  const { id: userId } = req.params;

  try {
    const fundraisers = await Fundraiser.find({ userId }).populate(
      "userId",
      "name email"
    );

    res.status(200).json({ success: true, data: fundraisers });
  } catch (error) {
    console.error("Error fetching fundraisers:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createFundRaiser,
  getFundraisers,
};
