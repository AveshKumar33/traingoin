const mongoose = require("mongoose");

const architectModal = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  Url: {
    type: String,
    required: true,
    unique: true,
  },

  maxDiscount: {
    type: Number,
    required: true,
  },

  userRole: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserRole",
      required: true,
    },
  ],

  Email: {
    type: String,
    validate: {
      validator: function (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  MobNumber: {
    type: Number,
    validate: {
      validator: function (num) {
        return String(num).length === 10;
      },
      message: "Mobile number must be 10 digits long",
    },
  },
  Address: {
    type: String,
    required: true,
  },
  firmName: {
    type: String,
    required: true,
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

  status: {
    type: Number,
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

module.exports = mongoose.model("architectModal", architectModal);
