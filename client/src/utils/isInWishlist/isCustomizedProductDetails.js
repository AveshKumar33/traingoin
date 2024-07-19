export const isCustomizedProductDetailsInWishlist = (
  customizedProduct,
  wishlist
) => {
  for (const product of wishlist) {
    if (product?.customizedProductId === customizedProduct?.productId) {
      if (compareProductCombinations(customizedProduct, product)) {
        return product;
      }
    }
  }
  return null;
};

const compareProductCombinations = (product1, product2) => {
  const compareSectionAttributes = (section1, section2) => {
    const section2FilteredData = section2?.filter((data) => data?.isShow);

    const sortedSection1 = section1?.slice()?.sort((a, b) => {
      const idA = a.attributeId?._id;
      const idB = b.attributeId?._id;
      return idA.localeCompare(idB);
    });

    const sortedSection2 = section2FilteredData?.slice()?.sort((a, b) => {
      const idA = a.attributeId;
      const idB = b.attributeId;
      return idA.localeCompare(idB);
    });

    return sortedSection1?.every((sec1, index) => {
      const sec2 = sortedSection2[index];

      return (
        sec1.attributeId?._id === sec2.attributeId &&
        sec1.parameterId === sec2.parameterId &&
        sec1.positionId === sec2.positionId &&
        sec1.positionX === sec2.positionX &&
        sec1.positionY === sec2.positionY
      );
    });
  };

  // if (product1.SAF.length !== product2.SAF) {
  //   return false;
  // }
  // if (product1.IB.length !== product2.IB) {
  //   return false;
  // }
  // if (product1.CB.length !== product2.CB) {
  //   return false;
  // }
  // if (product1.Front.length !== product2.Front) {
  //   return false;
  // }

  return (
    compareSectionAttributes(product1.SAF, product2.SAF) &&
    compareSectionAttributes(product1.IB, product2.IB) &&
    compareSectionAttributes(product1.CB, product2.CB) &&
    compareSectionAttributes(product1.Front, product2.Front)
  );
};
