export const ActionTypes = {
  SET_CART_SINGLE_PRODUCT: "SET_CART_SINGLE_PRODUCT",
  SET_CART_CUSTOMIZE_PRODUCT: "SET_CART_CUSTOMIZE_PRODUCT",
  SET_ROOT_COLLECTION: "SET_ROOT_COLLECTION",
  SET_BLOGS: "SET_BLOGS",
  SET_PRODUCT_COMBINATIONS: "SET_PRODUCT_COMBINATIONS",
  SET_ALL_DOT_PRODUCTS: "SET_ALL_DOT_PRODUCTS",
  SET_PROJECT: "SET_PROJECT",
  SET_SLIDER: "SET_SLIDER",
  SET_CATALOGUE: "SET_CATALOGUE",
  SET_MOST_SELLING_COLLECTIONS: "SET_MOST_SELLING_COLLECTIONS",
  SET_TOP_FIVE_REVIEWS: "SET_TOP_FIVE_REVIEWS",
  SET_CUSTOMIZE_PRODUCT_COMBINATIONS: "SET_CUSTOMIZE_PRODUCT_COMBINATIONS",
  SET_CONTACT_US: "SET_CONTACT_US",
};

export const initialState = {
  cartSingleProducts: [],
  cartCustomizeProducts: [],
  rootCollection: [],
  blogs: [],
  productCombinations: [],
  allDotProducts: [],
  project: [],
  slider: [],
  Catalogue: [],
  mostSellingCollections: [],
  topFiveReviews: [],
  customizeProductCombinations: [],
  contactUs: {},
};

export const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_CART_SINGLE_PRODUCT:
      return { ...state, cartSingleProducts: action.payload };
    case ActionTypes.SET_CART_CUSTOMIZE_PRODUCT:
      return { ...state, cartCustomizeProducts: action.payload };
    case ActionTypes.SET_ROOT_COLLECTION:
      return { ...state, rootCollection: action.payload };
    case ActionTypes.SET_BLOGS:
      return { ...state, blogs: action.payload };
    case ActionTypes.SET_PRODUCT_COMBINATIONS:
      return { ...state, productCombinations: action.payload };
    case ActionTypes.SET_ALL_DOT_PRODUCTS:
      return { ...state, allDotProducts: action.payload };
    case ActionTypes.SET_PROJECT:
      return { ...state, project: action.payload };
    case ActionTypes.SET_SLIDER:
      return { ...state, slider: action.payload };
    case ActionTypes.SET_CATALOGUE:
      return { ...state, Catalogue: action.payload };
    case ActionTypes.SET_MOST_SELLING_COLLECTIONS:
      return { ...state, mostSellingCollections: action.payload };
    case ActionTypes.SET_TOP_FIVE_REVIEWS:
      return { ...state, topFiveReviews: action.payload };
    case ActionTypes.SET_CUSTOMIZE_PRODUCT_COMBINATIONS:
      return { ...state, customizeProductCombinations: action.payload };
    case ActionTypes.SET_CONTACT_US:
      return { ...state, contactUs: action.payload };
    default:
      return state;
  }
};
