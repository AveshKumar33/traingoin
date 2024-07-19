export const isCustomizedComboProductInWishlist = (
  customizedComboProducts,
  wishlist
) => {
  const productId = customizedComboProducts[0];

  for (const product of wishlist) {
    if (product.customizedComboId === productId?.customizedComboId) {
      if (
        compareProductCombinationsRectangle(customizedComboProducts, product)
      ) {
        return product;
      }
    }
  }
  return null;
};

const compareProductCombinationsRectangle = (product, wishlistProduct) => {
  const compareSectionAttributes = (section1, section2) => {
    if (section1?.length === 0 && section2?.length === 0) {
      return true;
    }

    const sortedSection1 = section1
      ?.slice()
      ?.sort((a, b) => a.attributeId.localeCompare(b.attributeId));
    const sortedSection2 = section2
      .slice()
      ?.sort((a, b) => a?.attributeId?._id.localeCompare(b.attributeId?._id));

    return sortedSection1.every(
      ({ attributeId, parameterId, positionId }, index) => {
        if (!sortedSection2[index]) {
          return false;
        }
        const {
          attributeId: attrId,
          parameterId: paramId,
          positionId: posId,
          //   positionX: posX,
          //   positionY: posY,
        } = sortedSection2[index];
        return (
          attributeId === attrId?._id &&
          parameterId === paramId?._id &&
          positionId === posId?._id
        );
      }
    );
  };

  const wishlistRectagle = wishlistProduct?.customizedComboRectangle;

  //   console.log("wishlistRectagle", wishlistRectagle);
  //   console.log("product", product);

  if (!wishlistRectagle || wishlistRectagle.length !== product.length) {
    return false;
  }

  return wishlistRectagle.every((data1, index) => {
    const data2 = product[index];

    // console.log("SAF", compareSectionAttributes(data1?.SAF, data2?.SAF));
    // console.log("FRONT", compareSectionAttributes(data1.Front, data2.Front));
    // console.log("IB", compareSectionAttributes(data1.IB, data2.IB));
    // console.log("CB", compareSectionAttributes(data1.CB, data2.CB));

    return (
      compareSectionAttributes(data1?.SAF, data2?.SAF) &&
      compareSectionAttributes(data1.IB, data2.IB) &&
      compareSectionAttributes(data1.CB, data2.CB) &&
      compareSectionAttributes(data1.Front, data2.Front)
    );
  });
};
