export const ActionTypes = {
  SET_CART_SINGLE_PRODUCT: "SET_CART_SINGLE_PRODUCT",
  SET_CART_CUSTOMIZE_PRODUCT: "SET_CART_CUSTOMIZE_PRODUCT",
  SET_ALL_CHILD_COLLECTIONS: "SET_ALL_CHILD_COLLECTIONS",
  SET_COLLECTION_DETAILS: "SET_COLLECTION_DETAILS",
  SET_PRODUCT_COMBINATIONS: "SET_PRODUCT_COMBINATIONS",
  SET_CUSTOMIZE_PRODUCT_COMBINATION: "SET_CUSTOMIZE_PRODUCT_COMBINATION",
};

export const initialState = {
  cartSingleProducts: [],
  cartCustomizeProducts: [],
  allChildCollections: [],
  collectiondetails: [],
  productCombinations: [],
  customizeProductCombinations: [],
};

export const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_CART_SINGLE_PRODUCT:
      return { ...state, cartSingleProducts: action.payload };
    case ActionTypes.SET_CART_CUSTOMIZE_PRODUCT:
      return { ...state, cartCustomizeProducts: action.payload };
    case ActionTypes.SET_ALL_CHILD_COLLECTIONS:
      return { ...state, allChildCollections: action.payload };
    case ActionTypes.SET_COLLECTION_DETAILS:
      return { ...state, collectiondetails: action.payload };
    case ActionTypes.SET_PRODUCT_COMBINATIONS:
      return { ...state, productCombinations: action.payload };
    case ActionTypes.SET_CUSTOMIZE_PRODUCT_COMBINATION:
      return { ...state, customizeProductCombinations: action.payload };
    default:
      return state;
  }
};
