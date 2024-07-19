import { configureStore } from "@reduxjs/toolkit";
import newProductSlice from "./slices/newProductSlice";
import tagSlice from "./slices/tagSlice";
import CollectionFilterSlice from "./slices/CollectionFilterSlice";
import collectionSlice from "./slices/collectionSlice";

//persisted Reducer
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import gallerySlice from "./slices/gallerySlice";
import menuSlice from "./slices/menuSlice";
import cartSlice from "./slices/cartSlice";
import productBundleSlice from "./slices/bundleSlice";
import newAttributeslice from "./slices/newAttributeSlice";
import EnquirySlice from "./slices/enquirySlice";
import CatalogueSlice from "./slices/catalogueSlice";
import ExperienceSlice from "./slices/experienceSlice";
import aboutUsSlice from "./slices/aboutUsSlice";
import exibhitionsSlice from "./slices/exibhitionsSlice";
import wishlistSlice from "./slices/wishlistSlice";
import sliderSlice from "./slices/sliderSlice";
import dotCustomizedproductslice from "./slices/dotCustomizedProductSlice";
import newCollectionFilterSlice from "./slices/newCollectionFilterSlice";
import newWishlistSlice from "./slices/newWishlistSlice";
import raiseAQuerySlice from "./slices/raiseAQuerySlice";
import uiSlice from "./slices/ui-slice";

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import { encryptTransform } from "redux-persist-transform-encrypt";

import userSlice from "./slices/userSlice";
import uomSlice from "./slices/UOMSlice";
import userRoleSlice from "./slices/userRoleSlice";
import couponSlice from "./slices/couponSlice";
import orderSlice from "./slices/orderSlice";
import reviewSlice from "./slices/reviewSlice";
import authSlice from "./slices/authSlice";
import dotProductSlice from "./slices/dotProductSlice";
import dotProductSliceNew from "./slices/dotProductSliceNew";
import dotProductImageSlice from "./slices/dotProductImageSlice";
import dotCustomisationSlice from "./slices/dotCustomisationSlice";
import projectcategorySlice from "./slices/projectcategorySlice";
import projectSlice from "./slices/projectSlice";
import architectSlice from "./slices/architectSlice";
import parameterSlice from "./slices/parameterSlice";
import positionSlice from "./slices/positionSlice";
import customizeProductSlice from "./slices/customizeProductSlice";
import newDotCustomizedProductSlic from "./slices/newDotCustomizedProductSlice";
import dotCustomizedProductImageSlice from "./slices/dotCustomizedProductImageSlice";
import customizeComboSlice from "./slices/customizeComboSlice";
import customizeComboRectangleSlice from "./slices/customizeComboRectangleSlice";
import newCartSlice from "./slices/newCartSlice";
import orderStatusSlice from "./slices/orderStatusSlice";

const reducers = combineReducers({
  newProducts: newProductSlice,
  tags: tagSlice,
  CollectionFilter: CollectionFilterSlice,
  newCollectionFilter: newCollectionFilterSlice,
  collections: collectionSlice,
  gallery: gallerySlice,
  user: userSlice,
  uoms: uomSlice,
  userRoles: userRoleSlice,
  coupons: couponSlice,
  orders: orderSlice,
  orderStatus: orderStatusSlice,
  review: reviewSlice,
  menu: menuSlice,
  cart: cartSlice,
  auth: authSlice,
  productBundle: productBundleSlice,
  parameters: parameterSlice,
  newAttribute: newAttributeslice,
  positions: positionSlice,
  dotProduct: dotProductSlice,
  newDotProduct: dotProductSliceNew,
  dotProductImage: dotProductImageSlice,
  customizeProduct: customizeProductSlice,
  customizeCombo: customizeComboSlice,
  customizeComboRectangle: customizeComboRectangleSlice,
  dotCustomizedProductImage: dotCustomizedProductImageSlice,
  dotcustomization: dotCustomisationSlice,
  newDotCustomization: newDotCustomizedProductSlic,
  enquiry: EnquirySlice,
  catalogue: CatalogueSlice,
  experience: ExperienceSlice,
  aboutUs: aboutUsSlice,
  exibhitions: exibhitionsSlice,
  whishlist: wishlistSlice,
  projectCategory: projectcategorySlice,
  project: projectSlice,
  slider: sliderSlice,
  dotCustomizedproduct: dotCustomizedproductslice,
  architect: architectSlice,
  wishlist: newWishlistSlice,
  raiseQuery: raiseAQuerySlice,
  ui: uiSlice,
  newCartSlice: newCartSlice,
});

const persistConfig = {
  key: "root",
  storage,
  transforms: [
    encryptTransform({
      secretKey: "your-secret-key",
      //You Can Also remove by using this methods
      //   onError: function (error) {
      //     // Handle the error.
      //     // localStorage.clear()
      //     localStorage.removeItem("persist:root");
      //   },
    }),
  ],
  timeout: 1000,
  onRehydrate: () => {
    localStorage.removeItem("persist:root");
    // Handle the scenario where the data has been tampered with
    // You can check the integrity of the data here and decide what action to take
    // In this example, we will remove the data from local storage if it has been tampered with
    PURGE();
  },
  blacklist: [
    "products",
    "tags",
    "collections",
    "gallery",
    "user",
    "coupons",
    "orders",
    "orderStatus",
    "review",
    "auth",
    "productBundle",
    "dotProduct",
    "dotcustomization",
    "enquiry",
    "catalogue",
    "slider",
    "dotCustomizedproduct",
    "newProducts",
    "newAttribute",
    "newDotProduct",
    "parameters",
    "positions",
    "userRoles",
    "dotProductImage",
    "newDotCustomization",
    "dotCustomizedProductImage",
    "customizeProduct",
    "uoms",
    "CollectionFilter",
    "newCollectionFilter",
    "customizeCombo",
    "customizeComboRectangle",
    "wishlist",
    "ui",
    "newCartSlice",
    "raiseAQuery",
  ],

  //Blacklisting and white listing Store
  // whitelist:["tags"]
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
