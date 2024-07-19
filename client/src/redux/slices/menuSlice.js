import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";

export const fetchMenus = createAsyncThunk("menus/fetchMenus", async () => {
  const { data } = await axiosInstance.get(
    "/api/collection/getHeader"
  );
  return data.data;
});

const menuSlice = createSlice({
  name: "menus",
  initialState: {
    menus: [],
    loading: "idle",
    error: null,
    message: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get menus
      .addCase(fetchMenus.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.menus = action.payload;
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      });
  },
});

export default menuSlice.reducer;
