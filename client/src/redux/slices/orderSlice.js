import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  try {
    const { data } = await axiosInstance.get("/api/order", {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    return data.data;
  } catch (error) {
    toastError(error.response.data.message);
  }
});

export const fetchOrdersDetails = createAsyncThunk(
  "orders/fetchOrdersDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/order/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      return data.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);

export const fetchOrderProductById = createAsyncThunk(
  "orders/fetchOrderProductById",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/order/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      return data;
    } catch (error) {
      toastError(error.response.data.message);
    }
  }
);

// using in update status page
export const fetchOrderProductByOrderItemId = createAsyncThunk(
  "orders/fetchOrderProductByOrderItemId",
  async ({ productType, orderId, orderItemId }) => {
    try {
      const { data } = await axiosInstance.get(
        `api/order/product/${productType}/${orderId}/${orderItemId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      return data;
    } catch (error) {
      toastError(error.response.data.message);
    }
  }
);

export const fetchOrderDetailsByUserId = createAsyncThunk(
  "orders/fetchOrderDetailsByUserId",
  async () => {
    try {
      const { data } = await axiosInstance.get(`/api/order/user/id`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      return data.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderdata) => {
    try {
      const { data } = await axiosInstance.post("/api/order", orderdata, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return toastError(error.response.data.message);
      } else {
        return toastError(error.message);
      }
    }
  }
);

export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async ({ id, orderdata, orderItemId }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/order/${id}/${orderItemId}`,
        orderdata,
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

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (orderId) => {
    await axiosInstance.delete(`/api/order/${orderId}`);
    return orderId;
  }
);

const orderslice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    orderProducts: [],
    useOrders: [],
    singleProducts: [],
    customizeProducts: [],
    singleDotProducts: [],
    customizeDotProducts: [],
    customizeComboProducts: [],
    createdOrder: {},
    loading: "idle",
    error: null,
    message: "",
    orderdetails: {},
    product: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get orders Details
      .addCase(fetchOrderProductById.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchOrderProductById.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.orderProducts = action.payload.data;
        state.singleProducts = action.payload.singleProducts;
        state.customizeProducts = action.payload.customizeProducts;
        state.singleDotProducts = action.payload.singleDotProducts;
        state.customizeDotProducts = action.payload.customizeDotProducts;
        state.customizeComboProducts = action.payload.customizeComboProducts;
      })
      .addCase(fetchOrderProductById.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get orders Details
      .addCase(fetchOrderProductByOrderItemId.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchOrderProductByOrderItemId.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.orderProducts = action.payload?.data;
        state.product = action.payload?.product;
      })
      .addCase(fetchOrderProductByOrderItemId.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      .addCase(fetchOrdersDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchOrdersDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.orderdetails = action.payload;
      })
      .addCase(fetchOrdersDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get orders Details by user id

      .addCase(fetchOrderDetailsByUserId.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchOrderDetailsByUserId.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.useOrders = action.payload;
      })
      .addCase(fetchOrderDetailsByUserId.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create order

      .addCase(createOrder.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.createdOrder = action.payload.data;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update order

      .addCase(updateOrder.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrder.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
      })
      .addCase(deleteOrder.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default orderslice.reducer;
