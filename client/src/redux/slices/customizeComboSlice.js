import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";

export const fetchCustomizedComboProduct = createAsyncThunk(
  "customizedComboProduct/fetchCustomizedComboProduct",
  async ({ searchData = "", currentPage = 0, rowsPerPage = 3 }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/customized-combo-product?search=${searchData}&page=${
          currentPage + 1
        }&limit=${rowsPerPage}`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

// export const fetchAllCustomizedComboProducts = createAsyncThunk(
//   "customizedComboProduct/fetchAllCustomizedComboProducts",
//   async () => {
//     try {
//       const { data } = await axiosInstance.get(
//         `/api/customized-combo-product/all`,
//         {},
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             token: localStorage.getItem("token"),
//           },
//         }
//       );

//       return data.data;
//     } catch (error) {
//       toastError(error?.response?.data?.message);
//     }
//   }
// );

export const fetchCustomizedComboProductDetails = createAsyncThunk(
  "customizedComboProduct/fetchCustomizedComboProductDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/customized-combo-product/${id}`
      );
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const createCustomizedComboProduct = createAsyncThunk(
  "customizedComboProduct/createCustomizedComboProduct",
  async (dotproductdata) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/customized-combo-product",
        dotproductdata,
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

export const updateCustomizedComboProduct = createAsyncThunk(
  "customizedComboProduct/updateCustomizedComboProduct",
  async ({ id, productdata }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/customized-combo-product/${id}`,
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

export const deleteCustomizedComboProduct = createAsyncThunk(
  "customizedComboProduct/deleteCustomizedComboProduct",
  async (productId) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/customized-combo-product/${productId}`,
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

const customizeComboProductSlice = createSlice({
  name: "customizedComboProduct",
  initialState: {
    customizedComboProduct: [],
    totalData: 0,
    loading: "idle",
    error: null,
    success: false,
    message: "",
    customizedComboProductDetails: {},
    dotProductBundleData: [],
    customizedComboProductId: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get dotproducts
      .addCase(fetchCustomizedComboProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCustomizedComboProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
        state.totalData = action.payload.totalCount;
        state.customizedComboProduct = action.payload.data;
      })
      .addCase(fetchCustomizedComboProduct.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      // .addCase(fetchAllCustomizedComboProducts.pending, (state) => {
      //   state.loading = "pending";
      // })
      // .addCase(fetchAllCustomizedComboProducts.fulfilled, (state, action) => {
      //   state.loading = "fulfilled";
      //   state.success = true;
      //   state.dotproducts = action.payload;
      // })
      // .addCase(fetchAllCustomizedComboProducts.rejected, (state, action) => {
      //   state.loading = "rejected";
      //   state.error = action.error.message;
      // })

      //Get dotproducts Details

      .addCase(fetchCustomizedComboProductDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetchCustomizedComboProductDetails.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          state.customizedComboProductDetails = action.payload;
        }
      )
      .addCase(fetchCustomizedComboProductDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create dotProduct

      .addCase(createCustomizedComboProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createCustomizedComboProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
      })
      .addCase(createCustomizedComboProduct.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update dotProduct

      .addCase(updateCustomizedComboProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateCustomizedComboProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
        state.customizedComboProductId = action.payload;
      })
      .addCase(updateCustomizedComboProduct.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete dotProduct
      .addCase(deleteCustomizedComboProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteCustomizedComboProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.customizedComboProductId = action.payload;
      })
      .addCase(deleteCustomizedComboProduct.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default customizeComboProductSlice.reducer;
