const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  mobNumber: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    required: true,
  },
  experienceImages: {
    type: [String],
  },

  status: {
    type: Number,
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
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },

  updatedAt: {
    type: Date,
    default: new Date().toISOString(),
  },
});

module.exports = mongoose.model("ExperienceModel", experienceSchema);
