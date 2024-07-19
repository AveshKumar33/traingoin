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

    const filterAndSort = (section) =>
      section
        .filter((data) => data?.isShow)
        .sort((a, b) => a.attributeId.localeCompare(b.attributeId));

    const filterAndSortSection2 = (section) =>
      section
        .filter((data) => data?.isShow)
        .sort((a, b) => a.attributeId?._id.localeCompare(b.attributeId?._id));

    const sortedSection1 = filterAndSort(section1);
    const sortedSection2 = filterAndSortSection2(section2);

    return sortedSection1.every(
      (
        { attributeId, parameterId, positionId, positionX, positionY },
        index
      ) => {
        if (sortedSection2?.length === 0) {
          return false;
        }

        const {
          attributeId: attrId,
          parameterId: paramId,
          positionId: posId,
          positionX: posX,
          positionY: posY,
        } = sortedSection2[index];
        return (
          attributeId === attrId?._id &&
          parameterId === paramId &&
          positionId === posId &&
          positionX === posX &&
          positionY === posY
        );
      }
    );
  };

  const wishlistRectagle = wishlistProduct?.customizedComboRectangle;

  if (!wishlistRectagle || wishlistRectagle.length !== product.length) {
    return false;
  }

  return wishlistRectagle.every((data1, index) => {
    const data2 = product[index];

    return (
      compareSectionAttributes(data1?.SAF, data2?.SAF) &&
      compareSectionAttributes(data1.IB, data2.IB) &&
      compareSectionAttributes(data1.CB, data2.CB) &&
      compareSectionAttributes(data1.Front, data2.Front)
    );
  });
};
