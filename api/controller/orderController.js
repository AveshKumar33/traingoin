const orderSchema = require("../modal/order");
const cartSchema = require("../modal/cartModal");
const orderCounterSchema = require("../modal/orderCounterModel");
const customizedProductSchema = require("../modal/customizeProductModel");
const parameterPositionImageSchema = require("../modal/parameterPositionImageModal");
const singleProductCombinationSchema = require("../modal/singleProductCombinationModal");
const customizeComboRectangleModalSchema = require("../modal/customizeComboRectangleModal");
const customizedComboModelSchema = require("../modal/customizedComboModel");
const customizedProductCombinationSchema = require("../modal/customizeProductCombinationModal");
const dotProductSchema = require("../modal/dotProductModalNew");
const customizeDotProductSchema = require("../modal/customizeDotProductModal");
const { handleError } = require("../utils/handleError");
const Razorpay = require("razorpay");
require("dotenv").config();
const paytm = require("../utils/PaytmChecksum");
const https = require("https");
// const { v4: uuidv4 } = require("uuid");
const formidable = require("formidable");
const { ObjectId } = require("mongodb");

const getorders = async (req, res, next) => {
  try {
    const orders = await orderSchema.aggregate([
      {
        $sort: { orderId: -1 },
      },
    ]);
    res.status(200).json({
      success: true,
      data: orders,
      message: "Data fetched Successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const postorders = async (req, res, next) => {
  try {
    const { productPrice, ...rest } = req.body;

    // Fetch the cart data for the user
    const cartData = await cartSchema.aggregate([
      { $match: { userId: new ObjectId(req.user.id) } },
    ]);

    if (!cartData || cartData.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Fetch and update the order number
    let orderNoDoc = await orderCounterSchema.findOneAndUpdate(
      { id: "order" },
      { $inc: { orderNo: 1 } },
      { new: true }
    );

    if (!orderNoDoc) {
      orderNoDoc = new orderCounterSchema({ id: "order", orderNo: 1 });
      await orderNoDoc.save();
    }

    // Update cart data with product amounts
    const updatedCartData = cartData.map((data) => ({
      ...data,
      productAmount: productPrice[data._id],
      status: [],
    }));

    // Create a new order document
    const orderData = new orderSchema({
      ...rest,
      orderId: orderNoDoc.orderNo,
      orderItems: updatedCartData,
    });

    // Save the order to the database
    const orderDetails = await orderData.save();

    res
      .status(200)
      .json({ data: { orderId: orderDetails?.orderId }, success: true });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// const postorders = async (req, res, next) => {
//   try {
//     // // const lastDocument = await orderSchema.findOne({}, { $sort: { _id: -1 } },{projection: { _id: 0 }});
//     const lastDocument = await orderSchema
//       .find({})
//       .limit(1)
//       .sort({ $natural: -1 });
//     let lastdocumentdata = lastDocument[0];

//     if (lastDocument && lastdocumentdata && lastdocumentdata.OrderID) {
//       req.body.OrderID = lastdocumentdata.OrderID + 1;
//     } else {
//       req.body.OrderID = 1001;
//     }

//     // console.log("req", req.body)
//     const {
//       Amount,
//       Name,
//       Phone,
//       Email,
//       Coupon,
//       PinCode,
//       City,
//       State,
//       Address,
//       orderItems,
//       paymentStatus,
//       UserDetails,
//       DiscountAmount,
//       Remarks,
//       OrderID,
//     } = req.body;

//     const que = {};

//     if (Coupon & (Coupon != "undefined")) {
//       que["Coupon"] = Coupon;
//     }

//     let imgdata = [];

//     if (req.files) {
//       req?.files?.map((m) => imgdata.push(m.filename));
//     }
//     //Transfer to the Razorpay
//     const orderdata = await orderSchema.create({
//       Amount,
//       OrderID,
//       Name,
//       Phone,
//       Email,
//       PinCode,
//       City,
//       State,
//       Address,
//       orderItems: JSON.parse(orderItems),
//       paymentStatus,
//       UserDetails,
//       DiscountAmount,
//       Remarks,
//       orderFiles: imgdata,
//       ...que,
//     });
//     let order = await razorpayPayment(Amount);

//     res.status(200).json({ order, orderdata });

//     //Transfer to PAytm
//     // const orderdata = await orderSchema.create(req.body);

//     // paytmPayment.then((response) => {
//     //   console.log(response,"sss")

//     // }).catch((error)=>{
//     //   console.log("error",error)
//     // })

//     // const order = await orderSchema.create(req.body);

//     // let paytmParams = await paytmPayment(order._id);

//     // console.log("paytmpara", paytmParams);

//     // console.log("two");
//     // console.log("paytmParams", paytmParams);

//     // res.status(200).json({
//     //   paytmParams,
//     // });
//   } catch (error) {
//     console.log(error, "error");
//     next(handleError(500, error.message));
//   }
// };

const getSingleProductCombination = async (orderItem) => {
  const productCombinations = [];

  for (let data of orderItem) {
    if (!data?.singleProductId) {
      continue;
    }
    let productCombination = await singleProductCombinationSchema.aggregate([
      {
        $match: {
          singleProductId: new ObjectId(data?.singleProductId),
          combinations: {
            $all: data.singleProductCombinations.map((combination) => ({
              $elemMatch: {
                attributeId: new ObjectId(combination.attributeId),
                parameterId: new ObjectId(combination.parameterId),
              },
            })),
          },
        },
      },
    ]);

    const result = await singleProductCombinationSchema.populate(
      productCombination,
      [
        {
          path: "singleProductId",
          populate: [
            { path: "attribute" },
            { path: "Collection", select: "title url" },
          ],
        },
      ]
    );

    if (result?.length > 0) {
      productCombinations.push({ ...data, ...result[0], _id: data?._id });
    }
  }

  return productCombinations;
};

const getCUstomizeProductCombination = async (orderItem) => {
  const updatedWishlist = [];

  for (let cart of orderItem) {
    if (!cart?.customizedProductId) {
      continue;
    }

    const arrays = ["Front", "SAF", "CB", "IB"];

    const combinations = {};

    const customizeProduct = await customizedProductSchema.aggregate([
      { $match: { _id: new ObjectId(cart.customizedProductId) } },
    ]);

    const populatedcCstomizeProduct = await customizedProductSchema.populate(
      customizeProduct,
      [
        {
          path: "Collection",
          select: "title url",
        },
        {
          path: "attribute",
          populate: [{ path: "UOMId", select: "name" }],
          select: "-createdAt -updatedAt -createdBy -updatedBy",
        },
      ]
    );

    for (let array of arrays) {
      const arrayCombinations = [];

      for (let field of cart[array]) {
        if (!field?.isShow) {
          continue;
        }

        const parameterPositionData = await parameterPositionImageSchema.aggregate(
          [
            {
              $match: {
                attributeId: new ObjectId(field?.attributeId),
                parameterId: new ObjectId(field?.parameterId),
                positionId: new ObjectId(field?.positionId),
              },
            },
          ]
        );

        if (parameterPositionData.length > 0) {
          const populatedCombination = await parameterPositionImageSchema.populate(
            parameterPositionData,
            [
              {
                path: "attributeId",
                populate: [{ path: "UOMId", select: "name" }],
                select: "-createdAt -updatedAt -createdBy -updatedBy",
              },
              {
                path: "positionId",
                select: "-createdAt -updatedAt -createdBy -updatedBy",
              },
              {
                path: "parameterId",
                select: "-createdAt -updatedAt -createdBy -updatedBy",
                populate: [
                  {
                    path: "attributeId",
                    populate: [{ path: "UOMId", select: "name" }],
                    select: "-createdAt -updatedAt -createdBy -updatedBy",
                  },
                ],
              },
            ]
          );
          arrayCombinations.push(populatedCombination[0]);
        }
      }

      combinations[`${array}Combinations`] = arrayCombinations;
    }

    updatedWishlist.push({
      ...cart,
      customizeProduct: populatedcCstomizeProduct[0],
      ...combinations,
    });
  }

  return updatedWishlist;
};

const getSingleDotProducts = async (orderItem) => {
  const singleDotProduct = [];

  const productIds = orderItem.map((data) => {
    if (data?.singleDotProductId) {
      return new ObjectId(data?.singleDotProductId);
    }
  });

  // fetching single dot products
  const dotProductFilters = await dotProductSchema.aggregate([
    {
      $match: { _id: { $in: productIds } },
    },
    {
      $match: { status: 1 },
    },
    {
      $sort: { displaySequence: 1 },
    },
  ]);

  const resultSP = await dotProductSchema.populate(dotProductFilters, [
    {
      path: "dotProductImageIds",
      populate: {
        path: "dots.productId",
        select: "ProductName Urlhandle Collection GSTIN",
        populate: {
          path: "Collection",
          select: "title url",
        },
      },
      select: "-createdAt -updatedAt -createdBy -updatedBy ",
    },
  ]);

  if (resultSP?.length > 0) {
    for (let product of resultSP) {
      const combination = [];

      const cartDetails = orderItem.find((data) => {
        if (
          data?.singleDotProductId &&
          data?.singleDotProductId.toString() === product?._id.toString()
        ) {
          return data;
        }
      });

      for (let dotsImageIds of product?.dotProductImageIds) {
        for (let dots of dotsImageIds?.dots) {
          const productCombinations = await singleProductCombinationSchema.aggregate(
            [
              {
                $match: {
                  singleProductId: new ObjectId(dots?.productId?._id),
                  isDefault: true,
                },
              },
            ]
          );

          const result = await singleProductCombinationSchema.populate(
            productCombinations,
            [
              {
                path: "singleProductId",
                select: "ProductName Urlhandle Collection GSTIN",
              },
            ]
          );
          combination.push(result[0]);
        }
      }
      singleDotProduct.push({
        ...cartDetails,
        ...product,
        productCombination: combination,
        _id: cartDetails?._id,
        status: cartDetails?.status,
      });
    }
  }

  return singleDotProduct;
};

const getCustomizeDotProucts = async (orderItem) => {
  const customizeDotProduct = [];

  const productIds = orderItem.map((data) => {
    if (data?.customizeDotProductId) {
      return new ObjectId(data?.customizeDotProductId);
    }
  });

  const customizeDotProductFilters = await customizeDotProductSchema.aggregate([
    {
      $match: { _id: { $in: productIds } },
    },
    {
      $match: { status: 1 },
    },
    {
      $sort: { displaySequence: 1 },
    },
  ]);

  const resultCP = await customizeDotProductSchema.populate(
    customizeDotProductFilters,
    [
      {
        path: "dotProductImageIds",
        populate: {
          path: "dots.productId",
          select: "ProductName Urlhandle Collection GSTIN",
        },
        select: "-createdAt -updatedAt -createdBy -updatedBy ",
      },
    ]
  );

  if (resultCP && resultCP?.length > 0) {
    for (let result of resultCP) {
      const customizeCombination = [];

      const cartDetails = orderItem.find((data) => {
        if (data?.customizeDotProductId) {
          return (
            data?.customizeDotProductId.toString() === result?._id.toString()
          );
        }
      });

      for (let dotsImageIds of result?.dotProductImageIds) {
        for (let dots of dotsImageIds?.dots) {
          const customizedProductsCombinations = await customizedProductCombinationSchema.aggregate(
            [
              {
                $match: {
                  productId: new ObjectId(dots?.productId?._id),
                },
              },
            ]
          );

          const customizedProductsCombinationsData = await customizedProductCombinationSchema.populate(
            customizedProductsCombinations,
            [
              {
                path: "CB.parameterId",
                select: "name price",
                populate: {
                  path: "attributeId",
                  select: "Name UOMId",
                  populate: {
                    path: "UOMId",
                    select: "name",
                  },
                },
              },
              {
                path: "Front.parameterId",
                select: "name price",
                populate: {
                  path: "attributeId",
                  select: "Name UOMId",
                  populate: {
                    path: "UOMId",
                    select: "name",
                  },
                },
              },
              {
                path: "IB.parameterId",
                select: "name price",
                populate: {
                  path: "attributeId",
                  select: "Name UOMId",
                  populate: {
                    path: "UOMId",
                    select: "name",
                  },
                },
              },
              {
                path: "SAF.parameterId",
                select: "name price",
                populate: {
                  path: "attributeId",
                  select: "Name UOMId",
                  populate: {
                    path: "UOMId",
                    select: "name",
                  },
                },
              },
              {
                path: "productId",
                populate: {
                  path: "Collection",
                  select: "url",
                },
              },
            ]
          );

          customizeCombination.push(customizedProductsCombinationsData[0]);
        }
      }

      customizeDotProduct.push({
        ...cartDetails,
        ...result,
        productCombination: customizeCombination,
        _id: cartDetails?._id,
        status: cartDetails?.status,
      });
    }
  }

  return customizeDotProduct;
};

const getCustomizedComboProducts = async (orderItem) => {
  const filteredData = orderItem?.filter((data) => data.customizedComboId);

  const cartDataForUIStringify = JSON.stringify(filteredData);
  const parsedData = JSON.parse(cartDataForUIStringify);

  for (let data of parsedData) {
    const customizedCombo = await customizedComboModelSchema.aggregate([
      {
        $match: {
          _id: new ObjectId(data.customizedComboId),
        },
      },
    ]);

    for (let rectangle of data.customizedComboRectangle) {
      const customizedComboRectangle = await customizeComboRectangleModalSchema.aggregate(
        [
          {
            $match: {
              _id: new ObjectId(rectangle.customizedComboRectangleId),
            },
          },
        ]
      );

      const customizedProduct = await customizedProductSchema.aggregate([
        {
          $match: {
            _id: new ObjectId(rectangle.customizedProductId),
          },
        },
      ]);

      const populatedData = await customizedProductSchema.populate(
        customizedProduct,
        [
          {
            path: "Collection",
            select: "title url",
          },
          {
            path: "attribute",
            populate: [{ path: "UOMId", select: "name" }],
            select: "-createdAt -updatedAt -createdBy -updatedBy",
          },
        ]
      );

      rectangle.customizedComboRectangleId = customizedComboRectangle[0];
      rectangle.customizedProductId = populatedData[0];
    }

    data.customizedComboId = customizedCombo[0];
  }

  for (let cart of parsedData) {
    for (let i = 0; i < cart?.customizedComboRectangle.length; i++) {
      const rectangle = cart.customizedComboRectangle[i];
      const arrays = ["Front", "SAF", "CB", "IB"];

      const combinations = {};

      for (let array of arrays) {
        const arrayCombinations = await Promise.all(
          rectangle[array].map(async (field) => {
            const parameterPositionData = await parameterPositionImageSchema.aggregate(
              [
                {
                  $match: {
                    attributeId: new ObjectId(field?.attributeId),
                    parameterId: new ObjectId(field?.parameterId),
                    positionId: new ObjectId(field?.positionId),
                  },
                },
              ]
            );

            if (parameterPositionData.length > 0) {
              const populatedCombination = await parameterPositionImageSchema.populate(
                parameterPositionData,
                [
                  {
                    path: "attributeId",
                    populate: [{ path: "UOMId", select: "name" }],
                    select: "-createdAt -updatedAt -createdBy -updatedBy",
                  },
                  {
                    path: "positionId",
                    select: "-createdAt -updatedAt -createdBy -updatedBy",
                  },
                  {
                    path: "parameterId",
                    select: "-createdAt -updatedAt -createdBy -updatedBy",
                    populate: [
                      {
                        path: "attributeId",
                        populate: [{ path: "UOMId", select: "name" }],
                        select: "-createdAt -updatedAt -createdBy -updatedBy",
                      },
                    ],
                  },
                ]
              );
              return populatedCombination[0];
            } else {
              return null;
            }
          })
        );

        combinations[`${array}Combinations`] = arrayCombinations;
      }

      cart.customizedComboRectangle[i] = {
        ...rectangle,
        ...combinations,
      };
    }
  }

  return parsedData;
};

const getOrderedProduct = async (req, res, next) => {
  try {
    const orders = await orderSchema.aggregate([
      {
        $match: { _id: new ObjectId(req.params.id) },
      },
    ]);

    const populatedOrder = await orderSchema.populate(orders, [
      {
        path: "orderItems.status.status",
        select: "-createdAt -updatedAt -createdBy -updatedBy",
      },
    ]);

    let singleProducts;
    let customizeProducts;
    let singleDotProducts;
    let customizeDotProducts;
    let customizeComboProducts;

    if (orders && orders?.length > 0) {
      const products = orders[0].orderItems;

      singleProducts = await getSingleProductCombination(products);
      customizeProducts = await getCUstomizeProductCombination(products);
      singleDotProducts = await getSingleDotProducts(products);
      customizeDotProducts = await getCustomizeDotProucts(products);
      customizeComboProducts = await getCustomizedComboProducts(products);
    }

    res.status(200).json({
      success: true,
      data: populatedOrder,
      singleProducts,
      customizeProducts,
      singleDotProducts,
      customizeDotProducts,
      customizeComboProducts,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getOrderProductByOrderItemId = async (req, res, next) => {
  try {
    const { productType, orderId, orderItemId } = req.params;

    const orders = await orderSchema.aggregate([
      {
        $match: {
          _id: new ObjectId(orderId),
          "orderItems._id": new ObjectId(orderItemId),
        },
      },
    ]);

    const populatedOrder = await orderSchema.populate(orders, [
      {
        path: "orderItems.status.status",
        select: "-createdAt -updatedAt -createdBy -updatedBy",
      },
    ]);

    if (!orders?.length) {
      res.status(404).json({
        success: false,
        message: "Order not found!",
      });

      return;
    }

    const orderItems = orders[0].orderItems;

    const orderedProduct = orderItems.find(
      (item) => item._id.toString() === orderItemId.toString()
    );

    let product;

    switch (productType) {
      case "singleProducts":
        product = await getSingleProductCombination([orderedProduct]);
        break;
      case "customizeProducts":
        product = await getCUstomizeProductCombination([orderedProduct]);
        break;
      case "singleDotProducts":
        product = await getSingleDotProducts([orderedProduct]);
        break;
      case "customizeDotProducts":
        product = await getCustomizeDotProucts([orderedProduct]);
        break;
      case "customizeComboProducts":
        product = await getCustomizedComboProducts([orderedProduct]);
        break;
    }

    res.status(200).json({
      success: true,
      data: populatedOrder,
      product,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const putorders = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const orderItemId = req.params.orderItemId;
    const newStatus = req.body;

    if (!orderId || (!!orderItemId && !Array.isArray(newStatus))) {
      return next(handleError(400, "orderId and newStatus are required"));
    }

    // const updatedOrder = await orderSchema.updateOne(
    //   { _id: orderId },
    //   { $push: { status: { $each: newStatus } } }
    // );

    const updatedOrder = await orderSchema.updateOne(
      {
        _id: new ObjectId(orderId),
        "orderItems._id": new ObjectId(orderItemId),
      },
      { $push: { "orderItems.$.status": { $each: newStatus } } }
    );

    if (updatedOrder.nModified === 0) {
      return next(handleError(404, "Order not found or no changes made"));
    }

    res.status(200).json({
      success: true,
      message: "Order Updated Successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getorderdetails = async (req, res, next) => {
  try {
    const orders = await orderSchema.findById(req.params.id).populate("Coupon");
    res.status(200).json({
      success: true,
      data: orders,
      message: "Data Fetched Successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const getAllOrdersByUserId = async (req, res, next) => {
  try {
    const orders = await orderSchema.aggregate([
      {
        $match: { userDetails: new ObjectId(req.user.id) },
      },
      {
        $sort: { orderId: 1 },
      },
    ]);
    // .populate("Coupon");
    res.status(200).json({
      success: true,
      data: orders,
      message: " Fetched All orders Successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const deleteorders = async (req, res, next) => {
  try {
    const orders = await orderSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "orders Deleted Successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const razorpayPayment = async (Amount) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: Amount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);

    return order;
  } catch (error) {
    return error;
  }
};

const paytmPayment = async (orderid) => {
  // const { amount, email, phoneNo } = req.body;
  let amount = 100;
  let email = "mihir@digisidekick.com";
  let phoneNo = 9110193437;

  var params = {};

  /* initialize an array */
  params["MID"] = process.env.PAYTM_MID;
  params["WEBSITE"] = process.env.PAYTM_WEBSITE;
  params["CHANNEL_ID"] = process.env.PAYTM_CHANNEL_ID;
  params["INDUSTRY_TYPE_ID"] = process.env.PAYTM_INDUSTRY_TYPE_ID;
  params["ORDER_ID"] = 2293;
  params["CUST_ID"] = process.env.PAYTM_CUST_ID;
  params["TXN_AMOUNT"] = JSON.stringify(amount);
  // params["CALLBACK_URL"] = `${req.protocol}://${req.get("host")}/api/v1/callback`;/paytm/callback
  params["CALLBACK_URL"] = `http://localhost:7000/api/order/paytm/callback`;
  params["EMAIL"] = email;
  params["MOBILE_NO"] = phoneNo;

  try {
    let paytmChecksum = await paytm.generateSignature(
      params,
      process.env.PAYTM_MERCHANT_KEY
    );

    let paytmParams = {
      ...params,
      CHECKSUMHASH: paytmChecksum,
    };

    return paytmParams;

    // const checksumdata = await paytmChecksum();

    // console.log("checksumdata",checksumdata)
  } catch (error) {
    console.log("error");
  }

  // paytmChecksum
  //   .then(function (checksum) {
  //     let paytmParams = {
  //       ...params,
  //       CHECKSUMHASH: checksum,
  //     };

  //     console.log("ssss", paytmParams);

  //     // res.status(200).json({
  //     //     paytmParams
  //     // });
  //     return paytmParams;
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
};

const paytmCallback = (req, res, next) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, file) => {
    var paytmChecksum = fields.CHECKSUMHASH;
    delete fields.CHECKSUMHASH;

    var isVerifySignature = paytm.verifySignature(
      fields,
      process.env.PAYTM_MERCHANT_KEY,
      paytmChecksum
    );
    if (isVerifySignature) {
      var paytmParams = {};
      paytmParams["MID"] = fields.MID;
      paytmParams["ORDERID"] = fields.ORDERID;

      /*
       * Generate checksum by parameters we have
       * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
       */
      paytm
        .generateSignature(paytmParams, process.env.PAYTM_MERCHANT_KEY)
        .then(function (checksum) {
          paytmParams["CHECKSUMHASH"] = checksum;

          var post_data = JSON.stringify(paytmParams);

          var options = {
            /* for Staging */
            // hostname: 'securegw-stage.paytm.in',

            /* for Production */
            hostname: "securegw.paytm.in",

            port: 443,
            path: "/order/status",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": post_data.length,
            },
          };

          var response = "";
          var post_req = https.request(options, function (post_res) {
            post_res.on("data", function (chunk) {
              response += chunk;
            });

            post_res.on("end", function () {
              let result = JSON.parse(response);
              if (result.STATUS === "TXN_SUCCESS") {
                // res.json(result)
                orderSchema
                  .findByIdAndUpdate(
                    result.ORDERID,
                    {
                      $set: {
                        paymentStatus: "Successfull",
                      },
                    },
                    { new: true }
                  )
                  .then(() => console.log("Update success"))
                  .catch(() => console.log("Unable to update"));
              }

              // res.redirect(`https://jdmorgaan.com/status/${result.ORDERID}`)
              res.redirect(
                `http://railingo.rankarts.in/status/${result.ORDERID}`
              );
            });
          });

          post_req.write(post_data);
          post_req.end();
        });
    } else {
      console.log("Checksum Mismatched");
    }

    // let paytmChecksum = req.body.CHECKSUMHASH;
    // delete req.body.CHECKSUMHASH;

    // let paytmChecksum = fields.CHECKSUMHASH;
    // delete fields.CHECKSUMHASH;

    // let isVerifySignature = paytm.verifySignature(
    //   fields,
    //   process.env.PAYTM_MERCHANT_KEY,
    //   paytmChecksum
    // );
    // if (isVerifySignature) {
    //   // console.log("Checksum Matched");

    //   var paytmParams = {};

    //   paytmParams.body = {
    //     mid: fields.MID,
    //     orderId: fields.ORDERID,
    //   };

    //   paytm
    //     .generateSignature(
    //       JSON.stringify(paytmParams.body),
    //       process.env.PAYTM_MERCHANT_KEY
    //     )
    //     .then(function (checksum) {
    //       paytmParams.head = {
    //         signature: checksum,
    //       };

    //       /* prepare JSON string for request */
    //       var post_data = JSON.stringify(paytmParams);

    //       var options = {
    //         /* for Staging */
    //         // hostname: "securegw-stage.paytm.in",

    //         /* for Production */

    //         hostname: "securegw.paytm.in",
    //         port: 443,
    //         path: "/v3/order/status",
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //           "Content-Length": post_data.length,
    //         },
    //       };

    //       // Set up the request
    //       var response = "";
    //       var post_req = https.request(options, function (post_res) {
    //         post_res.on("data", function (chunk) {
    //           response += chunk;
    //         });

    //         post_res.on("end", function () {
    //           let { body } = JSON.parse(response);

    //           console.log("body",body)

    //           // let status = body.resultInfo.resultStatus;
    //           // res.json(body);
    //           // addPayment(body);

    //           console.log("reqqqq", body);
    //           // res.redirect(`${req.protocol}://${req.get("host")}/order/${body.orderId}`)
    //           res.redirect(`http://localhost:5173/orderdetails`);
    //         });
    //       });

    //       // post the data
    //       post_req.write(post_data);
    //       post_req.end();
    //     });
    // } else {
    //   console.log("Checksum Mismatched");
    // }
  });
};

const updateOrderItem = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const newStatus = req.body;

    console.log("orderId", orderId);
    console.log("newStatus", newStatus);

    // if (!orderId || !Array.isArray(newStatus)) {
    //   return next(handleError(400, "orderId and newStatus are required"));
    // }

    // const updatedOrder = await orderSchema.updateOne(
    //   { _id: orderId },
    //   { $push: { status: { $each: newStatus } } }
    // );

    // if (updatedOrder.nModified === 0) {
    //   return next(handleError(404, "Order not found or no changes made"));
    // }

    res.status(200).json({
      success: true,
      message: "Order Updated Successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

const InstallmentPayment = async (req, res, next) => {
  try {
    const { Amount } = req.body;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: Amount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: Date.now(),
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });

    // next(handleError(500,error.message))
  }
};

module.exports = {
  deleteorders,
  getorderdetails,
  putorders,
  postorders,
  getorders,
  paytmCallback,
  updateOrderItem,
  InstallmentPayment,
  getAllOrdersByUserId,
  getOrderedProduct,
  getOrderProductByOrderItemId,
};
