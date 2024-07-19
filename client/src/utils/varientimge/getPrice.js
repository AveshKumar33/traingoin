const getUnitOfMeasurement = (uoms, id) => {
  return uoms.find((uom) => uom._id === id);
};

export const getPrice = (productDetails, combinations, UOM, defaultConf) => {
  let { DefaultHeight: P_Height, DefaultWidth: P_Width } = defaultConf || {};

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
    const unit = getUnitOfMeasurement(UOM, combination.attributeId.UOMId);

    if (
      !combination?.combinations[0]?.parameterId ||
      combination?.combinations?.length === 0
    ) {
      continue;
    }

    let currentParameterPrice =
      combination?.combinations[0]?.parameterId?.price;

    let price = Number(currentParameterPrice);

    // console.log("P_Height", P_Height);
    // console.log("P_Width", P_Width);
    // console.log("unit?.name", unit?.name);

    switch (unit?.name) {
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
      parameter: combination?.combinations[0]?.parameterId?.name,
      unit: unit?.name,
    });
  }

  // console.log("productDetails", productDetails);
  // console.log("varientimage", varientimage);
  // console.log("defaultConf", defaultConf);

  let totalprice = varientimage.reduce(
    (sum, item) => sum + (item.price ? item.price : 0),
    0
  );
  return totalprice;

  //   if (attributePosition) {
  //     for (const attributeitem of attribute) {
  //       mergedattributewithposition.push({
  //         ...attributeitem,
  //         ...attributePosition.find((p) => p.Name === attributeitem.Name),
  //       });
  //     }
  //   } else {
  //     for (const attributeitem of attribute) {
  //       mergedattributewithposition.push({
  //         ...attributeitem,
  //       });
  //     }
  //   }

  //   const { images, OriginalPrice, ProductInStockQuantity, i, ...varient } =
  //     varientobj || {};

  //   let varientimage = [];

  //   for (const attributeitem of mergedattributewithposition) {
  //     for (const varientlist in varient) {
  //       if (attributeitem.Name === varientlist) {
  //         for (const optionvalue of attributeitem.OptionsValue) {
  //           if (optionvalue._id === varient[`${varientlist}Id`]) {
  //             let price = optionvalue.AttributePrice;
  //             if (P_Height === 0) {
  //               P_Height = 1;
  //             }
  //             if (P_Width === 0) {
  //               P_Width = 1;
  //             }
  //             switch (attributeitem?.UOM) {
  //               case "Pair":
  //                 price = price * 2;
  //                 break;
  //               case "Pice":
  //                 break;
  //               case "SQFEET":
  //                 price = price * P_Height * P_Width;
  //                 break;
  //               case "Length":
  //                 price = price * P_Height;
  //                 break;
  //               case "Width":
  //                 price = price * P_Width;
  //                 break;
  //             }
  //             varientimage.push({
  //               ...optionvalue,
  //               price,
  //               attributeprice: optionvalue.AttributePrice,
  //             });
  //           }
  //         }
  //       }
  //     }
  //   }

  //   let totalprice = varientimage.reduce(
  //     (sum, item) => sum + (item.price ? item.price : 0),
  //     0
  //   );
};

export const getPriceForCollectionClient = (
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

export const getPriceForWishlist = (
  productDetails,
  combinations,
  defaultConf
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

export const calculateCustomizedPrice = (
  productDetails,
  UOM,
  combinations,
  priceFor
) => {
  if (productDetails && combinations?.length > 0) {
    const { DefaultWidth, DefaultHeight } = productDetails || {};

    const totalCustomizedPrice =
      productDetails[priceFor] +
      getPrice(productDetails, combinations, UOM, {
        DefaultWidth,
        DefaultHeight,
      });

    return totalCustomizedPrice;
  }
  return 0;
};
