const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  description: { type: String },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Refers to the company that created the campaign
  investors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // List of investors
});

module.exports = mongoose.model('Campaign', campaignSchema);
