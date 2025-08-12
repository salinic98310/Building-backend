const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  
  projectTitle: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // matches populate field
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  moneyRaised: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  // Additional fields can be added as needed

  title: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  description: { type: String },
  imageUrl: {type: String},
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Refers to the company that created the campaign
  investors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // List of investors
});

module.exports = mongoose.model('Campaign', campaignSchema);