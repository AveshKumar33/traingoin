const raiseAQuerySchema = require("../modal/raiseAQuerySchema");
const { ObjectId } = require("mongodb");
const customizedProductSchema = require("../modal/customizeProductModel");
const parameterPositionImageSchema = require("../modal/parameterPositionImageModal");

const getPriceForCollectionClient = (
  productDetails,
  combinations,
  defaultConf,
  isClientCOllection = true
) => {
  let { DefaultWidth: P_Width, DefaultHeight: P_Height } = defaultConf || {};

  let {
    DefaultWidth,
    MinWidth,
    MaxWidth,
    DefaultHeight,
    MinHeight,
    MaxHeight,
  } = productDetails || {};

  if (DefaultWidth || MinWidth || MaxWidth) {
    if (P_Width > MaxWidth) {
      P_Width = MaxWidth;
    }
    if (P_Width < MinWidth) {
      P_Width = MinWidth;
    }
  }
  if (DefaultHeight || MinHeight || MaxHeight) {
    if (P_Height > MaxHeight) {
      P_Height = MaxHeight;
    }
    if (P_Height < MinHeight) {
      P_Height = MinHeight;
    }
  }

  let varientimage = [];

  for (let combination of combinations) {
    if (!combination?.parameterId) {
      continue;
    }

    if (isClientCOllection && !combination?.isShow) {
      continue;
    }

    const unit = combination?.parameterId?.attributeId.UOMId?.name;

    let currentParameterPrice = combination?.parameterId?.price;

    let price = Number(currentParameterPrice);

    switch (unit) {
      case "Pair":
        price = price * 2;
        break;
      case "Pice":
        break;
      case "Sq.ft":
        price = price * P_Height * P_Width;
        break;
      case "Length":
        price = price * P_Height;
        break;
      case "Width":
        price = price * P_Width;
        break;
      default:
    }

    varientimage.push({
      price,
      parameter: combination?.parameterId?.name,
      unit: unit,
    });
  }

  let totalprice = varientimage.reduce(
    (sum, item) => sum + (item.price ? item.price : 0),
    0
  );

  return totalprice;
};

const calculateCustomizedPrice = (productDetails, combinations, priceFor) => {
  if (productDetails && combinations?.length > 0) {
    const { DefaultWidth, DefaultHeight } = productDetails || {};

    const totalCustomizedPrice =
      productDetails[priceFor] +
      getPriceForCollectionClient(
        productDetails,
        combinations,
        {
          DefaultWidth: DefaultWidth ? DefaultWidth : 0,
          DefaultHeight: DefaultHeight ? DefaultHeight : 0,
        },
        false
      );

    return totalCustomizedPrice;
  }
  return 0;
};

const getPercentage = (originalAmount, discountPercentage) => {
  let Amount = (originalAmount * discountPercentage) / 100;
  return Math.round(Amount);
};

// const getCustomizeProduct = async (req, res, next) => {
//   try {
//     const updatedWishlist = [];
//     const existingProduct = await raiseAQuerySchema.aggregate([
//       {
//         $match: { _id: new ObjectId(req.params.id) },
//       },
//     ]);

//     const queryDetails = await raiseAQuerySchema.populate(existingProduct, [
//       {
//         path: "architectId",
//         select: "-createdAt -updatedAt -createdBy -updatedBy",
//       },
//     ]);

//     let requestProduct;
//     if (existingProduct?.length > 0) {
//       requestProduct = existingProduct[0];

//       const arrays = ["Front", "SAF", "CB", "IB"];
//       const combinations = {};
//       const customizeProduct = await customizedProductSchema.aggregate([
//         { $match: { _id: new ObjectId(requestProduct.customizedProductId) } },
//       ]);
//       const populatedcCstomizeProduct = await customizedProductSchema.populate(
//         customizeProduct,
//         [
//           {
//             path: "Collection",
//             select: "title url",
//           },
//           {
//             path: "attribute",
//             populate: [{ path: "UOMId", select: "name" }],
//             select: "-createdAt -updatedAt -createdBy -updatedBy",
//           },
//         ]
//       );

//       for (let array of arrays) {
//         const arrayCombinations = [];

//         for (let field of requestProduct[array]) {
//           if (!field?.isShow) {
//             continue;
//           }

//           const parameterPositionData =
//             await parameterPositionImageSchema.aggregate([
//               {
//                 $match: {
//                   attributeId: new ObjectId(field?.attributeId),
//                   parameterId: new ObjectId(field?.parameterId),
//                   positionId: new ObjectId(field?.positionId),
//                 },
//               },
//             ]);

//           if (parameterPositionData.length > 0) {
//             const populatedCombination =
//               await parameterPositionImageSchema.populate(
//                 parameterPositionData,
//                 [
//                   {
//                     path: "attributeId",
//                     // populate: [{ path: "UOMId", select: "name" }],
//                     select: "-createdAt -updatedAt -createdBy -updatedBy",
//                   },
//                   {
//                     path: "positionId",
//                     select: "-createdAt -updatedAt -createdBy -updatedBy",
//                   },
//                   {
//                     path: "parameterId",
//                     select: "-createdAt -updatedAt -createdBy -updatedBy",
//                     populate: [
//                       {
//                         path: "attributeId",
//                         populate: [{ path: "UOMId", select: "name" }],
//                         select: "-createdAt -updatedAt -createdBy -updatedBy",
//                       },
//                     ],
//                   },
//                 ]
//               );
//             arrayCombinations.push(populatedCombination[0]);
//           }
//         }

//         combinations[`${array}Combinations`] = arrayCombinations;
//       }

//       updatedWishlist.push({
//         customizeProduct: populatedcCstomizeProduct[0],
//         ...combinations,
//       });
//     } else {
//       throw new Error("Product Not found");
//     }

//     let productDetails = null;
//     let product = null;
//     let frontCombination = [];
//     let backCombination = [];
//     let frontPrice = 0;
//     let backPrice = 0;

//     if (updatedWishlist && updatedWishlist?.length > 0) {
//       productDetails = updatedWishlist[0];
//       product = updatedWishlist[0].customizeProduct;
//     }

//     if (productDetails) {
//       frontCombination = productDetails?.FrontCombinations;
//     }

//     if (requestProduct?.customizedProductBackSelected === "SAF") {
//       backCombination = productDetails?.SAFCombinations;
//     } else if (requestProduct?.customizedProductBackSelected === "CB") {
//       backCombination = productDetails?.CBCombinations;
//     } else if (requestProduct?.customizedProductBackSelected === "IB") {
//       backCombination = productDetails?.IBCombinations;
//     }

//     if (product && frontCombination && frontCombination?.length > 0) {
//       frontPrice = calculateCustomizedPrice(
//         product,
//         frontCombination,
//         "FixedPrice"
//       );
//     }
//     if (product && backCombination && backCombination?.length > 0) {
//       backPrice = calculateCustomizedPrice(
//         product,
//         backCombination,
//         `FixedPrice${requestProduct?.customizedProductBackSelected}`
//       );
//     }

//     const totalBasePrice = frontPrice + backPrice;
//     const unit =
//       requestProduct?.customizeProductWidth &&
//       requestProduct?.customizeProductHeight
//         ? "Sq.ft"
//         : requestProduct?.customizeProductWidth
//         ? "Length"
//         : requestProduct?.customizeProductHeight
//         ? "Rft"
//         : "Pice";

//     let architectDetails = null;
//     let clientDetails = null;

//     if (queryDetails && queryDetails[0]) {
//       architectDetails = queryDetails[0]?.architectId;
//       clientDetails = queryDetails[0];
//     }

//     return {
//       architectDetails: architectDetails ? architectDetails : {},
//       clientDetails,
//       product,
//       frontCombination,
//       backCombination,
//       totalBasePrice,
//       unit,
//       productHeight: requestProduct?.customizeProductHeight,
//       productWidth: requestProduct?.customizeProductWidth,
//     };
//   } catch (error) {
//     next(error);
//   }
// };

const getCustomizeProduct = async (req, res, next) => {
  try {
    const productId = new ObjectId(req.params.id);

    // Fetch the existing product
    const existingProduct = await raiseAQuerySchema.aggregate([
      { $match: { _id: productId } },
    ]);

    if (!existingProduct.length) {
      throw new Error("Product Not Found");
    }

    const requestProduct = existingProduct[0];

    // Fetch the associated query details
    const queryDetails = await raiseAQuerySchema.populate(existingProduct, [
      {
        path: "architectId",
        select: "-createdAt -updatedAt -createdBy -updatedBy",
      },
    ]);

    // Fetch the customized product details
    const customizedProduct = await customizedProductSchema.aggregate([
      { $match: { _id: new ObjectId(requestProduct.customizedProductId) } },
    ]);

    const populatedCustomizedProduct = await customizedProductSchema.populate(
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

    const combinations = await getCombinations(requestProduct, [
      "Front",
      "SAF",
      "CB",
      "IB",
    ]);

    const updatedWishlist = [
      {
        customizeProduct: populatedCustomizedProduct[0],
        ...combinations,
      },
    ];

    // Determine front and back combinations and prices
    const { frontCombination, backCombination, frontPrice, backPrice } =
      await getProductCombinationsAndPrices(requestProduct, updatedWishlist);

    const totalBasePrice = frontPrice + backPrice;
    const unit = getUnit(requestProduct);

    const architectDetails = queryDetails?.[0]?.architectId || {};
    const clientDetails = queryDetails?.[0] || {};

    return {
      architectDetails,
      clientDetails,
      product: populatedCustomizedProduct[0],
      frontCombination,
      backCombination,
      totalBasePrice,
      unit,
      productHeight: requestProduct.customizeProductHeight,
      productWidth: requestProduct.customizeProductWidth,
    };
  } catch (error) {
    next(error);
  }
};

const getCombinations = async (requestProduct, arrays) => {
  const combinations = {};

  for (const array of arrays) {
    const arrayCombinations = [];

    for (const field of requestProduct[array]) {
      if (!field?.isShow) continue;

      const parameterPositionData =
        await parameterPositionImageSchema.aggregate([
          {
            $match: {
              attributeId: new ObjectId(field?.attributeId),
              parameterId: new ObjectId(field?.parameterId),
              positionId: new ObjectId(field?.positionId),
            },
          },
        ]);

      if (parameterPositionData.length > 0) {
        const populatedCombination =
          await parameterPositionImageSchema.populate(parameterPositionData, [
            {
              path: "attributeId",
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
          ]);
        arrayCombinations.push(populatedCombination[0]);
      }
    }

    combinations[`${array}Combinations`] = arrayCombinations;
  }

  return combinations;
};

const getProductCombinationsAndPrices = async (
  requestProduct,
  updatedWishlist
) => {
  let frontCombination = [];
  let backCombination = [];
  let frontPrice = 0;
  let backPrice = 0;

  if (updatedWishlist?.length > 0) {
    const productDetails = updatedWishlist[0];
    const product = updatedWishlist[0].customizeProduct;

    if (productDetails) {
      frontCombination = productDetails.FrontCombinations;
    }

    if (requestProduct.customizedProductBackSelected === "SAF") {
      backCombination = productDetails.SAFCombinations;
    } else if (requestProduct.customizedProductBackSelected === "CB") {
      backCombination = productDetails.CBCombinations;
    } else if (requestProduct.customizedProductBackSelected === "IB") {
      backCombination = productDetails.IBCombinations;
    }

    if (product && frontCombination.length > 0) {
      frontPrice = calculateCustomizedPrice(
        product,
        frontCombination,
        "FixedPrice"
      );
    }
    if (product && backCombination.length > 0) {
      backPrice = calculateCustomizedPrice(
        product,
        backCombination,
        `FixedPrice${requestProduct.customizedProductBackSelected}`
      );
    }
  }

  return { frontCombination, backCombination, frontPrice, backPrice };
};

const getUnit = (requestProduct) => {
  if (
    requestProduct.customizeProductWidth &&
    requestProduct.customizeProductHeight
  ) {
    return "Sq.ft";
  } else if (requestProduct.customizeProductWidth) {
    return "Length";
  } else if (requestProduct.customizeProductHeight) {
    return "Rft";
  } else {
    return "Piece";
  }
};

const formateAmount = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

function roundNumber(num) {
  const [integerPart, fractionalPart] = num.toString().split(".");

  if (!fractionalPart || fractionalPart.length < 2) {
    return num.toFixed(2);
  }

  const firstDecimalDigit = parseInt(fractionalPart.charAt(0));

  const roundedInteger =
    firstDecimalDigit >= 5 ? Math.ceil(integerPart) : Math.floor(integerPart);

  return `${roundedInteger}.00`;
}

function numberToWords(number) {
  const units = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convert(num) {
    if (num < 10) return units[num];
    if (num < 20) return teens[num - 10];
    if (num < 100)
      return (
        tens[Math.floor(num / 10)] +
        (num % 10 !== 0 ? " " + units[num % 10] : "")
      );
    if (num < 1000)
      return (
        units[Math.floor(num / 100)] +
        " Hundred" +
        (num % 100 !== 0 ? " " + convert(num % 100) : "")
      );
    if (num < 100000)
      return (
        convert(Math.floor(num / 1000)) +
        " Thousand" +
        (num % 1000 !== 0 ? " " + convert(num % 1000) : "")
      );
    if (num < 10000000)
      return (
        convert(Math.floor(num / 100000)) +
        " Lakh" +
        (num % 100000 !== 0 ? " " + convert(num % 100000) : "")
      );
    return "Number too large";
  }

  if (number === 0) return "Zero Rupees Only";

  const [integerPart, decimalPart] = number.toString().split(".");

  const integerWords = convert(parseInt(integerPart)) + " Rupees";
  const decimalWords = decimalPart
    ? " and " + convert(parseInt(decimalPart)) + " Paise"
    : "";

  return integerWords + decimalWords + " Only";
}

module.exports = {
  getCustomizeProduct,
  roundNumber,
  formateAmount,
  numberToWords,
  getPercentage,
};
