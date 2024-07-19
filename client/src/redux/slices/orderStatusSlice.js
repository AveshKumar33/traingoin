import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";

export const fetchOrderStatus = createAsyncThunk(
  "orderStatus/fetchOrderStatus",
  async () => {
    const { data } = await axiosInstance.get("/api/order-status");
    return data.data;
  }
);

export const fetchOrderStatusDetails = createAsyncThunk(
  "orderStatus/fetchOrderStatusDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/order-status/${id}`);
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const createOrderStatus = createAsyncThunk(
  "orderStatus/createOrderStatus",
  async (orderStatusData) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/order-status",
        orderStatusData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        toastSuceess(data?.message);
      }

      return data;
    } catch (error) {
      toastError(error.response?.data);
    }
  }
);

export const updateOrderStatusDetails = createAsyncThunk(
  "orderStatus/updateOrderStatusDetails",
  async ({ id, orderStatusData }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/order-status/${id}`,
        orderStatusData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        toastSuceess(data?.message);
      }

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const deleteOrderStatus = createAsyncThunk(
  "orderStatus/deleteOrderStatus",
  async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/api/order-status/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data?.success) {
        toastSuceess(data?.message);
      }

      return id;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

const orderStatusSlice = createSlice({
  name: "orderStatus",
  initialState: {
    orderStatus: [],
    loading: "idle",
    error: null,
    message: "",
    orderStatusDetails: {},
    orderStatusId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get tags
      .addCase(fetchOrderStatus.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchOrderStatus.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.orderStatus = action.payload;
      })
      .addCase(fetchOrderStatus.rejected, (state, action) => {
        state.loading = "rejected";
      })

      //Get Order Status Details

      .addCase(fetchOrderStatusDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchOrderStatusDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.orderStatusDetails = action.payload;
      })
      .addCase(fetchOrderStatusDetails.rejected, (state, action) => {
        state.loading = "rejected";
      })

      //Create tag

      .addCase(createOrderStatus.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createOrderStatus.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(createOrderStatus.rejected, (state, action) => {
        state.loading = "rejected";
      })

      //Update tag

      .addCase(updateOrderStatusDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateOrderStatusDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(updateOrderStatusDetails.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete tag

      .addCase(deleteOrderStatus.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteOrderStatus.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.orderStatusId = action.payload;
      })
      .addCase(deleteOrderStatus.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default orderStatusSlice.reducer;
