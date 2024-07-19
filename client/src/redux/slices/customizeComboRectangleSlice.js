import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";

export const fetchCustomizedComboProductRectangle = createAsyncThunk(
  "customizedComboProductRectangle/fetchCustomizedComboProductRectangle",
  async (productId) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/customized-combo-rectangle/all/${productId}`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

// for show in client
export const fetchAllCustomizedComboProductRectangle = createAsyncThunk(
  "customizedComboProductRectangle/fetchAllCustomizedComboProductRectangle",
  async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/customized-combo-rectangle/all-product`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchCustomizedComboProductRectangleDetailsForCiient =
  createAsyncThunk(
    "customizedComboProductRectangle/fetchCustomizedComboProductRectangleDetailsForCiient",
    async (id) => {
      try {
        const { data } = await axiosInstance.get(
          `/api/customized-combo-rectangle/client/${id}`
        );
        return data.data;
      } catch (error) {
        toastError(error?.response?.data?.message);
      }
    }
  );

export const fetchCustomizedComboProductRectangleDetails = createAsyncThunk(
  "customizedComboProductRectangle/fetchCustomizedComboProductRectangleDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/customized-combo-rectangle/${id}`
      );
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const createCustomizedComboProductRectangle = createAsyncThunk(
  "customizedComboProductRectangle/createCustomizedComboProductRectangle",
  async (productdata) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/customized-combo-rectangle",
        productdata,
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

export const updateCustomizedComboProductRectangle = createAsyncThunk(
  "customizedComboProductRectangle/updateCustomizedComboProductRectangle",
  async ({ id, productdata }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/customized-combo-rectangle/${id}`,
        productdata,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        toastSuceess(data?.message);
      }

      return id;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const deleteCustomizedComboectangle = createAsyncThunk(
  "customizedComboProductRectangle/deleteCustomizedComboectangle",
  async (productId) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/customized-combo-rectangle/${productId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        toastSuceess(data?.message);
      }

      return productId;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

const customizedComboRectangleSlice = createSlice({
  name: "customizedComboProductRectangle",
  initialState: {
    customizedComboRectangle: [],
    totalData: 0,
    loading: "idle",
    error: null,
    success: false,
    message: "",
    customizedComboProductRectangleDetails: {},
    dotProductBundleData: [],
    customizedComboProductRecatngleId: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get dotproducts
      .addCase(fetchCustomizedComboProductRectangle.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetchCustomizedComboProductRectangle.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          state.success = true;
          state.customizedComboRectangle = action.payload;
        }
      )
      .addCase(
        fetchCustomizedComboProductRectangle.rejected,
        (state, action) => {
          state.loading = "rejected";
          state.error = action.error.message;
        }
      )

      // fetch All Customized ComboProduct Rectangle

      .addCase(fetchAllCustomizedComboProductRectangle.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetchAllCustomizedComboProductRectangle.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          state.customizedComboRectangle = action.payload;
        }
      )
      .addCase(
        fetchAllCustomizedComboProductRectangle.rejected,
        (state, action) => {
          state.loading = "rejected";
        }
      )

      //fetch Customized ComboProduct Rectangle Details For Ciient

      .addCase(
        fetchCustomizedComboProductRectangleDetailsForCiient.pending,
        (state) => {
          state.loading = "pending";
        }
      )
      .addCase(
        fetchCustomizedComboProductRectangleDetailsForCiient.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          state.customizedComboProductRectangleDetails = action.payload;
        }
      )
      .addCase(
        fetchCustomizedComboProductRectangleDetailsForCiient.rejected,
        (state, action) => {
          state.loading = "rejected";
          state.error = action.error.message;
        }
      )

      .addCase(fetchCustomizedComboProductRectangleDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetchCustomizedComboProductRectangleDetails.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          state.customizedComboProductRectangleDetails = action.payload;
        }
      )
      .addCase(
        fetchCustomizedComboProductRectangleDetails.rejected,
        (state, action) => {
          state.loading = "rejected";
          state.error = action.error.message;
        }
      )

      //Create dotProduct

      .addCase(createCustomizedComboProductRectangle.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        createCustomizedComboProductRectangle.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          state.success = true;
        }
      )
      .addCase(
        createCustomizedComboProductRectangle.rejected,
        (state, action) => {
          state.loading = "rejected";
        }
      )

      //Update dotProduct

      .addCase(updateCustomizedComboProductRectangle.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        updateCustomizedComboProductRectangle.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          state.customizedComboProductRecatngleId = action.payload;
        }
      )
      .addCase(updateCustomizedComboProductRectangle.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete dotProduct
      .addCase(deleteCustomizedComboectangle.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteCustomizedComboectangle.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.customizedComboProductRecatngleId = action.payload;
      })
      .addCase(deleteCustomizedComboectangle.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default customizedComboRectangleSlice.reducer;
