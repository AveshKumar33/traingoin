import { createSlice } from "@reduxjs/toolkit";

export const dotCustomizationSlice = createSlice({
  name: "dotCustomization",

  initialState: {
    dotCustomization: [],
  },
  reducers: {
    addToBundleCustomization: (state, action) => {
      const checkcustomizedata = JSON.parse(
        JSON.stringify(state.dotCustomization)
      );

      // let { name, quantity, price, img, sellingType, Installment, ...rest } = {
      //   ...action.payload.product,
      // };

      const isItemExist = checkcustomizedata.find(
        (p) => String(p.id) === String(action.payload.product.id)
      );

      if (isItemExist) {
        // const existingbundledata = JSON.parse(JSON.stringify(state.bundledata));
        const existingdata = checkcustomizedata.map((s) =>
          s === isItemExist ? action.payload.product : s
        );
        state.dotCustomization = existingdata;
      } else {
        state.dotCustomization.push(action.payload.product);
      }
    },
  },
});

export const { addToBundleCustomization } = dotCustomizationSlice.actions;

export default dotCustomizationSlice.reducer;
