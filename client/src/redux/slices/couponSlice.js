import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";

export const fetchCoupons = createAsyncThunk(
  "coupons/fetchCoupons",
  async () => {
    const { data } = await axiosInstance.get("/api/coupon");
    return data.data;
  }
);

export const fetchCouponsDetails = createAsyncThunk(
  "coupons/fetchCouponsDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/coupon/${id}`);
      return data.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);
export const featchAvailableCoupons = createAsyncThunk(
  "coupons/featchAvailableCoupons",
  async () => {
    try {
      const { data } = await axiosInstance.get(`/api/coupon/available-coupons`);
      return data.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);

export const createCoupon = createAsyncThunk(
  "coupons/createCoupon",
  async (coupondata) => {
    try {
      const { data } = await axiosInstance.post("/api/coupon", coupondata, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      // const response = await axios.post("http://localhost:7000/api/coupon", coupondata);
      return data;
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  }
);

export const updateCoupon = createAsyncThunk(
  "coupons/updateCoupon",
  async ({ id, coupondata }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/coupon/${id}`,
        coupondata,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      return data.data;
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "coupons/deleteCoupon",
  async (couponId) => {
    await axiosInstance.delete(`/api/coupon/${couponId}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    return couponId;
  }
);

const couponSlice = createSlice({
  name: "coupons",
  initialState: {
    coupons: [],
    availableCoupons: [],
    loading: "idle",
    error: null,
    message: "",
    coupondetails: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get coupons
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.coupons = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get coupons Details

      .addCase(fetchCouponsDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCouponsDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.coupondetails = action.payload;
      })
      .addCase(fetchCouponsDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })
      /**get available Coupons */
      .addCase(featchAvailableCoupons.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(featchAvailableCoupons.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.availableCoupons = action.payload;
      })
      .addCase(featchAvailableCoupons.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create coupon

      .addCase(createCoupon.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.coupons.push(action.payload.data);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update coupon

      .addCase(updateCoupon.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        const index = state.coupons.findIndex(
          (coupon) => coupon._id === action.payload._id
        );
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
      })
      .addCase(updateCoupon.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete coupon
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.coupons = state.coupons.filter(
          (coupon) => coupon._id !== action.payload
        );
      })
      .addCase(deleteCoupon.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default couponSlice.reducer;
