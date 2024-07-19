const mongoose = require("mongoose");

const feelFreeToContactUsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name Can't be empty"],
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
    },
    mobNumber: {
      type: Number,
      required: [true, "MobileNumber is Required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}/.test(v);
        },
        message: "{VALUE} is not a valid 10 digit number!",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "FeelFreeToContactUsModel",
  feelFreeToContactUsSchema
);
