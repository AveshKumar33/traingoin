import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pageTitle: "",
};

const uiSlice = createSlice({
  name: "ui-slice",
  initialState: initialState,
  reducers: {
    title(state, action) {
      state.pageTitle = action.payload;
    },
  },
});

export const uiActon = uiSlice.actions;

export default uiSlice.reducer;
