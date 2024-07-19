const mongoose = require("mongoose");

const partnerWithUsSchema = new mongoose.Schema({
  pwusImage: {
    type: String,
  },
  status: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },

  updatedAt: {
    type: Date,
    default: new Date().toISOString(),
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("PartnerWithUsModal", partnerWithUsSchema);
