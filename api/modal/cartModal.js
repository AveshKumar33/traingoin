const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  archId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "architectModal",
  },
  quantity: {
    type: Number,
    default: 1,
  },

  singleProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SingleProductModel",
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

  customizeDotProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customizeDotProductSchema",
  },

  singleDotProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DotProductModel",
  },

  customizedProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomizedProductModel",
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

  customizedComboId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customizedCombo",
  },

  customizedComboRectangle: [
    {
      customizedComboRectangleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customizedComboRectangle",
      },

      customizedProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CustomizedProductModel",
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

      width: {
        type: Number,
      },

      height: {
        type: Number,
      },

      customizedProductBackSelected: {
        type: String,
        default: "",
      },
    },
  ],

  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },

  updatedAt: {
    type: Date,
    default: new Date().toISOString(),
  },
});

module.exports = mongoose.model("cart", cartSchema);
