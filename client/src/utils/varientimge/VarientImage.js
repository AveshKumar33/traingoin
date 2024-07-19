export const getvarientimage = (attribute, varientobj) => {
  const { images, OriginalPrice, ProductInStockQuantity, i, ...varient } =
    varientobj || {};

  let varientimage = [];

  for (const attributeitem of attribute) {
    for (const varientlist in varient) {
      if (attributeitem.Name === varientlist) {
        for (const optionvalue of attributeitem.OptionsValue) {
          if (optionvalue._id === varient[`${varientlist}Id`]) {
            varientimage.push({
              ...optionvalue,
              attributeitemId: attributeitem._id,
              Display_Index: attributeitem?.Display_Index ?? 0,
              BurgerSque: attributeitem?.BurgerSque ?? 0,
            });
          }
        }
      }
    }
  }

  return varientimage;
};

export const getvarientBackimage = (attribute, varientobj) => {
  // const {images,OriginalPrice,ProductInStockQuantity,i,...varient} = varientobj;

  let varientimage = [];

  for (const attributeitem of attribute) {
    for (const varientlist in varientobj) {
      if (attributeitem.Name === varientlist) {
        for (const optionvalue of attributeitem.OptionsValue) {
          if (optionvalue.Name === varientobj[varientlist]) {
            varientimage.push(optionvalue);
          }
        }
      }
    }
  }

  return varientimage;
};
