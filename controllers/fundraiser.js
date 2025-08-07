const Fundraiser = require("../models/Fundraiser");
const { uploadToCloudinary } = require("../utils/cloudinary");

const createFundRaiser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const fundraiserData = { ...req.body, userId: id };

    // Map of field name to cloudinary URL
    const imageFields = [
      "projectImage",
      "licenseImage",
      "kycImage",
      "panImage",
      "promoPoster",
    ];

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
      purpose, // ...other fields
    } = req.body;

    const fundraiser = {
      companyName,
      overview,
      purpose,
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

module.exports = {
  createFundRaiser,
  getFundraisers,
  submitFundraiser,
};
