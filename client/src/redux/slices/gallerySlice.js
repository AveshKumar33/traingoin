import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";

export const fetchGallery = createAsyncThunk(
  "gallery/fetchGallery",
  async (name) => {
    const { data } = await axiosInstance.get(`/api/uploads?name=${name}`);
    return data;
  }
);

export const createGallery = createAsyncThunk(
  "gallery/createGallery",
  async (productdata) => {
    try {
      const response = await axiosInstance.post("/api/product", productdata);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteGallery = createAsyncThunk(
  "gallery/deleteGallery",
  async (deletedata) => {
    const { url, index } = deletedata;
    console.log("dd",url,index)

    await axiosInstance.delete(`/api/uploads/${url}`);
    return index;
  }
);

const gallerylice = createSlice({
  name: "gallery",
  initialState: {
    gallery: [],
    loading: "idle",
    error: null,
    message: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get gallery
      .addCase(fetchGallery.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.gallery = action.payload;
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create Product
      .addCase(createGallery.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createGallery.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.gallery.push(action.payload.data);
      })
      .addCase(createGallery.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Delete Product
      .addCase(deleteGallery.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteGallery.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        // state.gallery = state.gallery.filter(
        //   (gallery) => gallery._id !== action.payload
        // );
        state.gallery = state.gallery.splice(action.payload, 1);
      })
      .addCase(deleteGallery.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default gallerylice.reducer;
