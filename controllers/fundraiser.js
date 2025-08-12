const Fundraiser = require("../models/Fundraiser");
const { uploadToCloudinary } = require("../utils/cloudinary");

const createFundRaiser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const fundraiserData = { ...req.body, userId: id };

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

    // Upload files to Cloudinary
    const photoUrl = req.files?.photo
      ? (await uploadToCloudinary(req.files.photo[0])).secure_url
      : null;

    const videoUrl = req.files?.video
      ? (await uploadToCloudinary(req.files.video[0])).secure_url
      : null;

    const promoVideoUrl = req.files?.promoVideo
      ? (await uploadToCloudinary(req.files.promoVideo[0])).secure_url
      : null;

    const promoPosterUrl = req.files?.promoPoster
      ? (await uploadToCloudinary(req.files.promoPoster[0])).secure_url
      : null;

    const licenseUrl = req.files?.license
      ? (await uploadToCloudinary(req.files.license[0])).secure_url
      : null;

    const kycUrl = req.files?.kyc
      ? (await uploadToCloudinary(req.files.kyc[0])).secure_url
      : null;

    const panUrl = req.files?.pan
      ? (await uploadToCloudinary(req.files.pan[0])).secure_url
      : null;

    // Create new fundraiser in DB
    const fundraiser = await Fundraiser.create({
      projectTitle,
      projectCategory,
      projectOverview,
      state,
      city,
      country,
      photo: photoUrl,
      video: videoUrl,
      promoVideo: promoVideoUrl,
      promoPoster: promoPosterUrl,
      moneyToRaise,
      daysToRaise,
      fundingType,
      introduction,
      license: licenseUrl,
      kyc: kycUrl,
      pan: panUrl,
      bankName,
      bankBranch,
      accountHolder,
      accountNumber,
      ifscCode,
      promoteCampaign,
      promotion
    });

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        if (imageFields.includes(file.fieldname)) {
          const result = await uploadToCloudinary(file);
          fundraiserData[file.fieldname] = result.secure_url;
        }
      }
    }

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

const submitFundraiser = async (req, res) => {
  try {
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

      // ...other fields
    } = req.body;

    const fundraiser = {
      companyName,
  overview,
  purpose,
  state,          // ✅ include
  country,        // ✅ include
  city,           // ✅ include
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
      // Save Cloudinary URLs
      photo: req.files["photo"]?.[0]?.path || null,
      video: req.files["video"]?.[0]?.path || null,
      promoVideo: req.files["promoVideo"]?.[0]?.path || null,
      promoPoster: req.files["promoPoster"]?.[0]?.path || null,
      license: req.files["license"]?.[0]?.path || null,
      kyc: req.files["kyc"]?.[0]?.path || null,
      pan: req.files["pan"]?.[0]?.path || null, // Optional, if needed
      // Add rest of the fields...
    };

    // Save to DB...
    const saved = await Fundraiser.create(fundraiser);
    res.status(201).json(saved);
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ error: "Submission failed" });
  }
};

const testCoundinary = async (req, res) => {
  try {
    const images = req.files.image; // this is an array of files
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
  testCoundinary,
};
