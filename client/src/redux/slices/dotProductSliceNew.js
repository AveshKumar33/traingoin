import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";

// const config = {
//   headers: {
//     "Content-Type": "application/json",
//     token: localStorage.getItem("token"),
//   },
// };

// const formdataconfig = {
//   headers: {
//     token: localStorage.getItem("token"),
//   },
// };

export const fetchdotProduct = createAsyncThunk(
  "dotproducts/fetchdotProduct",
  async ({ searchData = "", currentPage = 0, rowsPerPage = 3 }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/dot-product?search=${searchData}&page=${
          currentPage + 1
        }&limit=${rowsPerPage}`,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
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

export const fetchAllDotProducts = createAsyncThunk(
  "dotproducts/fetchAllDotProducts",
  async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/dot-product/all`,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
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

export const fetchDotProductByFilter = createAsyncThunk(
  "dotproducts/fetchDotProductByFilter",
  async ({ Tags }) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/dot-product/filterByTag",
        { Tags }
      );
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchdotProductDetails = createAsyncThunk(
  "dotproducts/fetchdotProductDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/dot-product/${id}`);
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchDotProductDetailsForRoomIdeaDetails = createAsyncThunk(
  "dotproducts/fetchDotProductDetailsForRoomIdeaDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/dot-product/client/${id}`);
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const createdotProduct = createAsyncThunk(
  "dotproducts/createdotProduct",
  async (dotproductdata) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/dot-product",
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

export const updatedotProduct = createAsyncThunk(
  "dotproducts/updatedotProduct",
  async ({ id, dotproductdata }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/dot-product/${id}`,
        dotproductdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        toastSuceess(data?.message);
      }

      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const deleteDotProduct = createAsyncThunk(
  "dotproducts/deletedotProduct",
  async (dotProductId) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/dot-product/${dotProductId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        toastSuceess(data?.message);
      }

      return dotProductId;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

const dotProductSliceNew = createSlice({
  name: "dotproducts",
  initialState: {
    dotproducts: [],
    totalData: 0,
    loading: "idle",
    error: null,
    success: false,
    message: "",
    dotProductdetails: {},
    dotProductBundleData: [],
    productId: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get dotproducts
      .addCase(fetchdotProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchdotProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
        state.totalData = action.payload?.totalCount || 0;
        state.dotproducts = action.payload?.data;
      })
      .addCase(fetchdotProduct.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      .addCase(fetchAllDotProducts.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchAllDotProducts.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
        state.dotproducts = action.payload;
      })
      .addCase(fetchAllDotProducts.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get dotproducts Details

      .addCase(fetchdotProductDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchdotProductDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.dotProductdetails = action.payload;
        // state.dotProductBundle = true
      })
      .addCase(fetchdotProductDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      .addCase(fetchDotProductDetailsForRoomIdeaDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetchDotProductDetailsForRoomIdeaDetails.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          state.dotProductdetails = action.payload;
          // state.dotProductBundle = true
        }
      )
      .addCase(
        fetchDotProductDetailsForRoomIdeaDetails.rejected,
        (state, action) => {
          state.loading = "rejected";
          state.error = action.error.message;
        }
      )

      //Create dotProduct

      .addCase(createdotProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createdotProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(createdotProduct.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      .addCase(fetchDotProductByFilter.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchDotProductByFilter.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.dotproducts = action.payload;
      })
      .addCase(fetchDotProductByFilter.rejected, (state, action) => {
        state.loading = "rejected";
      })
      //Update dotProduct

      .addCase(updatedotProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updatedotProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
        // const index = state.dotproducts.findIndex(
        //   (dotProduct) => dotProduct._id === action.payload._id
        // );
        // if (index !== -1) {
        //   state.dotproducts[index] = action.payload;
        // }
      })
      .addCase(updatedotProduct.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete dotProduct
      .addCase(deleteDotProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteDotProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productId = action.payload;
      })
      .addCase(deleteDotProduct.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export const { addDotProductToCart } = dotProductSliceNew.actions;

export default dotProductSliceNew.reducer;
