const mongoose = require("mongoose");

const raiseAQuerySchema = mongoose.Schema(
  {
    Name: {
      type: String,
      required: [true, "Name Can't be empty"],
    },
    Email: {
      type: String,
      required: [true, "Email is Required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    Address: {
      type: String,
    },
    gstNo: {
      type: String,
    },
    discount: {
      type: Number,
      default: 0,
    },
    singleProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SingleProductModel",
      // default: "",
    },

    singleProductCombinations: [
      {
        attributeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Attribute",
        },
        parameterId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Parameter",
        },
      },
    ],

    customizedProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomizedProductModel",
      // default: "",
    },

    customizedProductBackSelected: {
      type: String,
      default: "",
    },

    Front: [
      {
        attributeId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        positionX: {
          type: Number,
          default: 0,
        },
        positionY: {
          type: Number,
          default: 0,
        },
        isShow: {
          type: Boolean,
          default: false,
        },
        parameterId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Parameter",
        },
        positionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Position",
        },
      },
    ],

    SAF: [
      {
        attributeId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        positionX: {
          type: Number,
          default: 0,
        },
        positionY: {
          type: Number,
          default: 0,
        },
        isShow: {
          type: Boolean,
          default: false,
        },
        parameterId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Parameter",
        },
        positionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Position",
        },
      },
    ],

    CB: [
      {
        attributeId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        positionX: {
          type: Number,
          default: 0,
        },
        positionY: {
          type: Number,
          default: 0,
        },
        isShow: {
          type: Boolean,
          default: false,
        },
        parameterId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Parameter",
        },
        positionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Position",
        },
      },
    ],

    IB: [
      {
        attributeId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        positionX: {
          type: Number,
          default: 0,
        },
        positionY: {
          type: Number,
          default: 0,
        },
        isShow: {
          type: Boolean,
          default: false,
        },
        parameterId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Parameter",
        },
        positionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Position",
        },
      },
    ],

    customizeProductWidth: {
      type: Number,
    },

    customizeProductHeight: {
      type: Number,
    },
    architectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "architectModal",
    },
    // EnquiryFor: {
    //   type: String,
    //   enum:["Academy","Franchise","Contact Us","Machine"],
    // },
    // EquipmentName: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Product",
    //   required: [true, "Product Name Can't be Empty"]
    // },
    MobNumber: {
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
    Message: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("raiseAQuery", raiseAQuerySchema);
