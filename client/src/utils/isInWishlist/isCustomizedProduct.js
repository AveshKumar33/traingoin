export const isCustomizedProductInWishlist = (customizedProduct, wishlist) => {
  const productId = customizedProduct?.productId?._id
    ? customizedProduct?.productId?._id
    : customizedProduct?.customizedProductId?._id
    ? customizedProduct?.customizedProductId?._id
    : customizedProduct?.customizedProductId;

  for (const product of wishlist) {
    if (product.customizedProductId === productId) {
      if (compareProductCombinations(customizedProduct, product)) {
        return product;
      }
    }
  }
  return null;
};

const compareProductCombinations = (product1, product2) => {
  const compareSectionAttributes = (section1, section2) => {
    // const section1FilteredData = section1.filter((data) => data?.isShow);
    // const section2FilteredData = section2.filter((data) => data?.isShow);

    // const sortedSection1 = section1FilteredData.slice().sort((a, b) => {
    //   const idA = a.attributeId;
    //   const idB = b.attributeId;
    //   return idA.localeCompare(idB);
    // });

    // const sortedSection2 = section2FilteredData.slice().sort((a, b) => {
    //   const idA = a.attributeId;
    //   const idB = b.attributeId;
    //   return idA.localeCompare(idB);
    // });

    const filterAndSort = (section) =>
      section
        .filter((data) => data?.isShow)
        .sort((a, b) => a.attributeId.localeCompare(b.attributeId));

    const sortedSection1 = filterAndSort(section1);
    const sortedSection2 = filterAndSort(section2);

    return sortedSection1.every((sec1, index) => {
      const sec2 = sortedSection2[index];

      return (
        sec1.attributeId === sec2.attributeId &&
        sec1.parameterId?._id === sec2.parameterId &&
        sec1.positionId === sec2.positionId &&
        sec1.positionX === sec2.positionX &&
        sec1.positionY === sec2.positionY
      );
    });
  };

  // product1 = customizedProduct
  // product2 = wishlist

  return (
    compareSectionAttributes(product1.SAF, product2.SAF) &&
    compareSectionAttributes(product1.IB, product2.IB) &&
    compareSectionAttributes(product1.CB, product2.CB) &&
    compareSectionAttributes(product1.Front, product2.Front)
  );
};
