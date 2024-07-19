export const getAttriutePrice = (
  attribute,
  varientobj,
  attributePosition,
  defaultConf,
  productdetails
) => {
  let { P_Height, P_Width } = defaultConf || {};

  let {
    DefaultWidth,
    MinWidth,
    MaxWidth,
    DefaultHeight,
    MinHeight,
    MaxHeight,
  } = productdetails || {};

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

  let mergedattributewithposition = [];

  console.log("aaa", attributePosition);
  console.log("ttt", attribute);

  if (attributePosition) {
    for (const attributeitem of attribute) {
      mergedattributewithposition.push({
        ...attributeitem,
        ...attributePosition.find((p) => p.Name === attributeitem.Name),
      });
    }
  } else {
    for (const attributeitem of attribute) {
      mergedattributewithposition.push({
        ...attributeitem,
      });
    }
  }

  const { images, OriginalPrice, ProductInStockQuantity, i, ...varient } =
    varientobj || {};

  let varientimage = [];

  for (const attributeitem of mergedattributewithposition) {
    for (const varientlist in varient) {
      if (attributeitem.Name === varientlist) {
        for (const optionvalue of attributeitem.OptionsValue) {
          if (optionvalue._id === varient[`${varientlist}Id`]) {
            let price = optionvalue.AttributePrice;
            if (P_Height === 0) {
              P_Height = 1;
            }
            if (P_Width === 0) {
              P_Width = 1;
            }
            switch (attributeitem?.UOM) {
              case "Pair":
                price = price * 2;
                break;
              case "Pice":
                break;
              case "SQFEET":
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
              ...optionvalue,
              price,
              attributeprice: optionvalue.AttributePrice,
            });
          }
        }
      }
    }
  }

  let totalprice = varientimage.reduce(
    (sum, item) => sum + (item.price ? item.price : 0),
    0
  );

  return totalprice;
};

export const getAttriutePriceBack = (
  attribute,
  varientobj,
  attributePosition
) => {
  let mergedattributewithposition = [];

  if (attributePosition) {
    for (const attributeitem of attribute) {
      mergedattributewithposition.push({
        ...attributeitem,
        ...attributePosition.find((p) => p.Name === attributeitem.Name),
      });
    }
  } else {
    for (const attributeitem of attribute) {
      mergedattributewithposition.push({
        ...attributeitem,
      });
    }
  }

  const { images, OriginalPrice, ProductInStockQuantity, i, ...varient } =
    varientobj;

  let varientimage = [];

  for (const attributeitem of mergedattributewithposition) {
    for (const varientlist in varient) {
      if (attributeitem.Name === varientlist) {
        for (const optionvalue of attributeitem.OptionsValue) {
          if (optionvalue.Name === varient[varientlist]) {
            varientimage.push({
              ...optionvalue,
              price: attributeitem.Quantity * optionvalue.AttributePrice,
              quantity: attributeitem.Quantity,
              attributeprice: optionvalue.AttributePrice,
            });
          }
        }
      }
    }
  }

  let totalprice = varientimage.reduce(
    (sum, item) => sum + (item.price ? item.price : 0),
    0
  );

  return totalprice;
};
