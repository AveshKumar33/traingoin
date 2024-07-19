import { createSlice } from "@reduxjs/toolkit";

export const wishlistSlice = createSlice({
  name: "whislist",
  initialState: {
    whishlistdata: [],
    quantity: 0,
    lastUpdated: null,
  },
  reducers: {
    addToWhislist: (state, action) => {
      const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

      // const checkwhishlistdata = JSON.parse(
      //   JSON.stringify(state.whishlistdata)
      // );

      //const isItemExist = checkwhishlistdata.find((p) => p === action.payload);

      state.whishlistdata.push(action.payload);
      state.quantity += 1;
      state.lastUpdated = Date.now() + sevenDaysInMillis;

      // if (!isItemExist) {
      // }
    },

    removeToWhislist: (state, action) => {
      const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;
      const removeitem = JSON.parse(JSON.stringify(state.whishlistdata));

      const filtereddata = removeitem.filter(
        (i) => JSON.stringify(i?._id) !== JSON.stringify(action.payload)
      );
      if (removeitem.length > filtereddata.length) {
        state.quantity -= 1;
        state.lastUpdated = Date.now() + sevenDaysInMillis;
      }
      state.whishlistdata = filtereddata;
    },

    resetWhislist: (state, action) => {
      state.whishlistdata = [];
      state.quantity = 0;
    },

    verifyWhislist: (state, action) => {
      let currentdate = Date.now();
      if (state.lastUpdated - currentdate < 0) {
        state.whishlistdata = [];
        state.quantity = 0;
      }
    },
  },
});

export const {
  addToWhislist,
  removeToWhislist,
  resetWhislist,
  verifyWhislist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
