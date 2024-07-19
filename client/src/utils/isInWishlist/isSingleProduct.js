export const isSingleProductInWishlist = (wishlistProducts, product) => {
  for (let wishlistProduct of wishlistProducts) {
    if (wishlistProduct?.singleProductId === product?.singleProductId) {
      if (
        compareSingleProductCombinations(
          wishlistProduct?.singleProductCombinations,
          product?.singleProductCombinations
        )
      ) {
        return wishlistProduct;
      }
    }
  }
  return null;
};

const compareAttributes = (a, b) => {
  if (a.attributeId === b.attributeId) {
    return a.parameterId.localeCompare(b.parameterId);
  }
  return a.attributeId.localeCompare(b.attributeId);
};

const compareSingleProductCombinations = (combinations1, combinations2) => {
  if (
    !Array.isArray(combinations1) ||
    !Array.isArray(combinations2) ||
    combinations1.length !== combinations2.length
  ) {
    return false;
  }

  const sortedCombinations1 = combinations1.slice().sort(compareAttributes);
  const sortedCombinations2 = combinations2.slice().sort(compareAttributes);

  for (let i = 0; i < sortedCombinations1.length; i++) {
    const combination1 = sortedCombinations1[i];
    const combination2 = sortedCombinations2[i];

    if (
      combination1.attributeId !== combination2.attributeId ||
      combination1.parameterId !== combination2.parameterId
    ) {
      return false;
    }
  }
  return true;
};

// const compareSingleProductCombinations = (combinations1, combinations2) => {
//   if (
//     !Array.isArray(combinations1) ||
//     !Array.isArray(combinations2) ||
//     combinations1.length !== combinations2.length
//   ) {
//     return false;
//   }

//   console.log("combinations1", combinations1)
//   console.log("combinations2", combinations2)

//   // const stringified1 = JSON.stringify(combinations1);
//   // const stringified2 = JSON.stringify(combinations2);

//   // return stringified1 === stringified2;

//   //   for (let i = 0; i < sortedCombinations1.length; i++) {
//   //     const combination1 = sortedCombinations1[i];
//   //     const combination2 = sortedCombinations2[i];

//   //     if (
//   //       combination1.attributeId !== combination2.attributeId ||
//   //       combination1.parameterId !== combination2.parameterId
//   //     ) {
//   //       return false;
//   //     }
//   //   }
//   //   return true;
// };

export const isCustomizedDotProductInWishlist = (
  wishlistProducts,
  productId
) => {
  for (let wishlistProduct of wishlistProducts) {
    if (wishlistProduct?.customizeDotProductId === productId) {
      return wishlistProduct;
    }
  }
  return null;
};

export const isSingleDotProductInWishlist = (wishlistProducts, productId) => {
  for (let wishlistProduct of wishlistProducts) {
    if (wishlistProduct?.singleDotProductId === productId) {
      return wishlistProduct;
    }
  }
  return null;
};
