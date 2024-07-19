import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartdata: [],
    checkoutItem: [],
    quantity: 0,
    productPrice: {},
    lastUpdated: null,
  },
  reducers: {
    addTocart: (state, action) => {
      const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      state.cartdata.push(action.payload);
      state.quantity += 1;
      state.lastUpdated = Date.now() + sevenDaysInMillis;
    },

    removeTocart: (state, action) => {
      const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;
      const removeitem = JSON.parse(JSON.stringify(state.cartdata));

      const deletedId = action.payload;

      const filtereddata = removeitem.filter(
        (i) => i?._id.toString() !== deletedId.toString()
      );

      if (removeitem.length > filtereddata.length) {
        state.quantity -= 1;
        state.lastUpdated = Date.now() + sevenDaysInMillis;
      }
      state.cartdata = filtereddata;
    },

    setProductQuantity: (state, action) => {
      const { _id: updatedId, quantity: newQuantity } = action.payload;

      const cartItems = JSON.parse(JSON.stringify(state.cartdata));

      state.cartdata = cartItems.map((item) =>
        item._id.toString() === updatedId.toString()
          ? { ...item, quantity: newQuantity }
          : item
      );
    },

    setCartCheckoutItem: (state, action) => {
      state.checkoutItem = action.payload;
    },

    setCartCheckoutProductPrice: (state, action) => {
      state.productPrice = action.payload;
    },

    resetCart: (state, action) => {
      state.cartdata = [];
      state.checkoutItem = [];
      state.quantity = 0;
    },

    verifyCart: (state, action) => {
      let currentdate = Date.now();
      if (state.lastUpdated - currentdate < 0) {
        state.cartdata = [];
        state.quantity = 0;
      }
    },
    changePaymentMode: (state, action) => {
      const { index, item, paymentModeType } = action.payload;
      const cardData = JSON.parse(JSON.stringify(state.cartdata));
      // state.cartdata = [];
      // state.quantity = 0;

      if (paymentModeType === "Installment") {
        const { Installment, quantity } = cardData[index];

        let InstallmentPrice = Installment[0]?.Amount ?? 0;

        const myObj = {
          ...cardData[index],
          sellingType: paymentModeType,
          price: InstallmentPrice * quantity,
        };
        cardData.splice(index, 1, myObj);

        state.cartdata = cardData;
      }
      if (paymentModeType === "Normal") {
        const { OriginalPrice, quantity } = cardData[index];
        const myObj = {
          ...cardData[index],
          sellingType: paymentModeType,
          price: OriginalPrice * quantity,
        };
        cardData.splice(index, 1, myObj);
        state.cartdata = cardData;
      }
    },
  },
});

export const {
  addTocart,
  removeTocart,
  setProductQuantity,
  resetCart,
  verifyCart,
  changePaymentMode,
  setCartCheckoutItem,
  setCartCheckoutProductPrice,
} = cartSlice.actions;

export default cartSlice.reducer;
