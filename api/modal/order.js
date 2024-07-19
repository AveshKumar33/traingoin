const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Name is Required"],
    },
    lastName: {
      type: String,
      required: [true, "Name is Required"],
    },
    addressLine1: {
      type: String,
      required: [true, "Name is Required"],
    },
    addressLine2: {
      type: String,
    },
    pinCode: {
      type: Number,
      required: [true, "Pincode is Required"],
    },
    city: {
      type: String,
      required: [true, "City is Required"],
    },
    state: {
      type: String,
      required: [true, "State is Required"],
    },
    phoneNumber: {
      type: Number,
      required: [true, "Mob Number is Required"],
    },
    alternatePhoneNumber: {
      type: Number,
    },
    country: {
      type: String,
      required: [true, "Country is Required"],
    },

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },
    amount: {
      type: Number,
      required: [true, "Amount is Required"],
    },
    discountAmount: {
      type: Number,
      // required: [true,"Amount is Required"]
    },
    orderItems: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
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
        status: [
          {
            status: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "orderStatus",
            },
            message: {
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
          },
        ],

        productAmount: {
          type: Number,
        },
      },
    ],
    paymentStatus: {
      type: String,
    },
    paymentDetails: {
      type: Object,
    },
    userDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is Required"],
    },
    orderId: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
