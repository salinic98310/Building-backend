const mongoose = require("mongoose");

const fundraiserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Step 1: Project Details
  projectTitle: { type: String, required: true },
  projectOverview: { type: String, required: true },
  projectCategory: { type: String, enum: ["Business", "Startup", "Company Growth"], required: true },
  projectLocation: {
    state: { type: String },
    city: { type: String },
    country: { type: String },
  },
  photo: { type: String, required: false }, // store file URL
  video: { type: String }, // optional

  investors:[{
    title: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    moneyToRaise: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],
  // Step 2: Funding
  moneyToRaise: { type: Number, required: true },
  daysToRaise: { type: Number, required: true },
  fundingType: { type: String, enum: ["Profit Return", "Non-Profit Return"], required: true },
  profitPercentage: { type: Number }, // only if Profit Return

  // Step 3: Legal
  introduction: { type: String, required: true },
  license: { type: String, required: false },
  kyc: { type: String, required: false },
  pan: { type: String, required: false },


  // Step 4: Bank
  bankDetails: {
    bankName: String,
    bankBranch: String,
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
  },

  // Step 5: Promotion
  promoteCampaign: { type: Boolean, required: true },
  promoVideo: { type: String },
  promoPoster: { type: String },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Fundraiser", fundraiserSchema);
