const mongoose = require("mongoose");

const fundraiserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model to link fundraisers with users
    required: true,
  },
  companyName: { type: String, required: true },
  overview: { type: String, required: true },
  purpose: { type: String },
  state: { type: String },
  city: { type: String },
  pincode: { type: String },
  photo: { type: String }, // URL or file path of the photo uploaded
  video: { type: String }, // URL or file path of the video uploaded
  promoVideo: { type: String }, // URL or file path of promotional video
  promoPoster: { type: String }, // URL or file path of promotional poster
  promotion: { type: String, enum: ["yes", "no"], default: "no" }, // Whether the fundraiser is promoted
  moneyToRaise: { type: Number, required: true }, // Amount of money to raise
  fundingType: { type: String, enum: ["profit", "non-profit"], required: true }, // Profit or non-profit fundraising type
  profitPercentage: { type: Number }, // Profit percentage if fundraising is profit-based
  daysToRaise: { type: Number, required: true }, // Number of days to raise the funds
}, { timestamps: true });

const Fundraiser = mongoose.model("Fundraiser", fundraiserSchema);

module.exports = Fundraiser;
