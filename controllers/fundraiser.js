const Fundraiser = require("../models/Fundraiser");
const { uploadToCloudinary } = require("../utils/cloudinary");

const createFundRaiser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const fundraiserData = { ...req.body, userId:  id };

     const {
      projectTitle,
      projectCategory,
      projectOverview,
      state,
      city,
      country,
      moneyToRaise,
      daysToRaise,
      fundingType,
      introduction,
      bankName,
      bankBranch,
      accountHolder,
      accountNumber,
      ifscCode,
      promoteCampaign,
      promotion
    } = req.body;

    const fileFields = [
      "photo",
      "video",
      "promoVideo",
      "promoPoster",
      "license",
      "kyc",
      "pan",
    ];

    // Upload each file to Cloudinary if it exists
    for (const field of fileFields) {
      if (req.file?.[field]?.[0]) {
        const uploaded = await uploadToCloudinary(req.file[field][0]);
        fundraiserData[field] = uploaded.secure_url;
        console.log(uploaded);
      }
    }

    // Save once to DB
    const newFundraiser = await Fundraiser.create(fundraiserData);
    

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

const submitFundraiser = async (req, res) => {
  try {
    const { id } = req.params; // or req.user.id from auth middleware
    if (!id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      companyName,
      overview,
      purpose,
      projectCategory,
      projectTitle,
      state,
      country,
      city,
      moneyToRaise,
      daysToRaise,
      fundingType,
      profitPercentage,
      bankDetails,
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      promoteCampaign,
    } = req.body;

    const fundraiser = {
      userId: id,
      companyName,
      overview,
      purpose,
      state,
      country,
      city,
      projectCategory,
      projectTitle,
      moneyToRaise,
      daysToRaise,
      fundingType,
      profitPercentage,
      bankDetails,
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      promoteCampaign,
      photo: req.file["photo"]
        ? (await uploadToCloudinary(req.file["photo"][0])).secure_url
        : null,
      video: req.file["video"]
        ? (await uploadToCloudinary(req.file["video"][0])).secure_url
        : null,
      promoVideo: req.file["promoVideo"]
        ? (await uploadToCloudinary(req.file["promoVideo"][0])).secure_url
        : null,
      promoPoster: req.file["promoPoster"]
        ? (await uploadToCloudinary(req.file["promoPoster"][0])).secure_url
        : null,
      license: req.file["license"]
        ? (await uploadToCloudinary(req.file["license"][0])).secure_url
        : null,
      kyc: req.file["kyc"]
        ? (await uploadToCloudinary(req.file["kyc"][0])).secure_url
        : null,
      pan: req.file["pan"]
        ? (await uploadToCloudinary(req.file["pan"][0])).secure_url
        : null,
    };

    const saved = await Fundraiser.create(fundraiser);
    res.status(201).json(saved);
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ error: "Submission failed" });
  }
};

const testCloudinary = async (req, res) => {
  try {
    const images = req.file.image; // this is an array of file
    if (!images || images.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const result = await uploadToCloudinary(images[0]); // test one image
    res
      .status(200)
      .json({ message: "Upload successful", url: result.secure_url });
  } catch (error) {
    console.error("Cloudinary test failed:", error);
    res
      .status(500)
      .json({ message: "Cloudinary test failed", error: error.message });
  }
};

module.exports = {
  createFundRaiser,
  getFundraisers,
  submitFundraiser,
  testCloudinary,
};
