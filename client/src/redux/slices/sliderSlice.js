import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError } from "../../utils/reactToastify";

const formdataconfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export const fetchSlider = createAsyncThunk("/slider/fetchSlider", async () => {
  const { data } = await axiosInstance.get("/api/slider");
  return data.data;
});

export const postSlider = createAsyncThunk(
  "/slider/postSlider",
  async (fetchSliderdata) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/slider",
        fetchSliderdata,
        formdataconfig
      );
      // const response = await axios.post("http://localhost:7000/api/slider", reviewdata);
      return data;
    } catch (error) {
      toastError(error.response.data.message);
    }
  }
);

export const deleteSlider = createAsyncThunk(
  "/slider/deleteSlider",
  async (sliderId) => {
    await axiosInstance.delete(`/api/slider/${sliderId}`);
    return sliderId;
  }
);

const sliderSlice = createSlice({
  name: "slider",
  initialState: {
    slider: [],
    loading: "idle",
    error: null,
    success: false,
    message: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get reviews
      .addCase(fetchSlider.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchSlider.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.slider = action.payload;
      })
      .addCase(fetchSlider.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create review
      .addCase(postSlider.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(postSlider.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.slider.push(action?.payload?.data);
        state.success = true;
        state.message = action?.payload?.message;
      })
      .addCase(postSlider.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Delete Slider
      .addCase(deleteSlider.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteSlider.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.slider = state.slider.filter(
          (slider) => slider._id !== action.payload
        );
      })
      .addCase(deleteSlider.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default sliderSlice.reducer;
