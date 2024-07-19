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

export const fetchDotCustomizedProduct = createAsyncThunk(
  "dotCustomizedProducts/fetchDotCustomizedProduct",
  async ({ searchData = "", currentPage = 0, rowsPerPage = 3 }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/customize-dot-product?search=${searchData}&page=${
          currentPage + 1
        }&limit=${rowsPerPage}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
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

export const fetchAllDotCustomizedProducts = createAsyncThunk(
  "dotCustomizedProducts/fetchAllDotCustomizedProducts",
  async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/customize-dot-product/all`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
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

export const fetchDotCustomizedProductByFilter = createAsyncThunk(
  "dotCustomizedProducts/fetchDotCustomizedProductByFilter",
  async ({ Tags }) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/customize-dot-product/filterByTag",
        { Tags }
      );
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetCustomizedchdotPrDductDetails = createAsyncThunk(
  "dotCustomizedProducts/fetCustomizedchdotPrDductDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/customize-dot-product/${id}`
      );
      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetCustomizedchdotPrDductDetailsForEdit = createAsyncThunk(
  "dotCustomizedProducts/fetCustomizedchdotPrDductDetailsForEdit",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/customize-dot-product/edit/${id}`
      );
      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const createDotCustomizedProduct = createAsyncThunk(
  "dotCustomizedProducts/createDotCustomizedProduct",
  async (dotproductdata) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/customize-dot-product",
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

export const updateDotCustomizedProduct = createAsyncThunk(
  "dotCustomizedProducts/updateDotCustomizedProduct",
  async ({ id, dotproductdata }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/customize-dot-product/${id}`,
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
/**fetch all dot customized products having product id  */
export const fetchdotProductDetailsByProductId = createAsyncThunk(
  "dotproducts/fetchdotProductDetailsByProductId",
  async (pId) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/customize-dot-product/product-id/${pId}`
      );
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const deleteDotCustomizedProduct = createAsyncThunk(
  "dotCustomizedProducts/deletedotCustomizedProduct",
  async (dotProductId) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/customize-dot-product/${dotProductId}`,
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

const newDotCustomizedProductSlice = createSlice({
  name: "dotCustomizedProducts",
  initialState: {
    dotCustomizedProducts: [],
    totalData: 0,
    loading: "idle",
    error: null,
    success: false,
    allDotCustomizeproducts: [],
    message: "",
    dotCustomizedProductDetails: {},
    dotCustomizedProductDetailsForEdit: {},
    dotProductBundleData: [],
    custiomizedProductCombinations: [],
    deletedProductId: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get dotCustomizedProducts
      .addCase(fetchDotCustomizedProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchDotCustomizedProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
        state.totalData = action.payload.totalCount;
        state.dotCustomizedProducts = action.payload.data;
      })
      .addCase(fetchDotCustomizedProduct.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      /**fetch all dot customize dot products by product id */
      .addCase(fetchdotProductDetailsByProductId.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchdotProductDetailsByProductId.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.allDotCustomizeproducts = action.payload;
      })
      .addCase(fetchdotProductDetailsByProductId.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      // fetch All Dot Customized Products
      .addCase(fetchAllDotCustomizedProducts.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchAllDotCustomizedProducts.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
        state.dotCustomizedProducts = action.payload;
      })
      .addCase(fetchAllDotCustomizedProducts.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get dotCustomizedProducts Details

      .addCase(fetCustomizedchdotPrDductDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetCustomizedchdotPrDductDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.dotCustomizedProductDetails = action.payload.data;
        state.custiomizedProductCombinations =
          action.payload.customizedProductsCombinations;
        // state.dotProductBundle = true
      })
      .addCase(fetCustomizedchdotPrDductDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      .addCase(fetCustomizedchdotPrDductDetailsForEdit.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetCustomizedchdotPrDductDetailsForEdit.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          state.dotCustomizedProductDetailsForEdit = action?.payload?.data;
        }
      )
      .addCase(
        fetCustomizedchdotPrDductDetailsForEdit.rejected,
        (state, action) => {
          state.loading = "rejected";
          state.error = action.error.message;
        }
      )

      //Create dotProduct

      .addCase(createDotCustomizedProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createDotCustomizedProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
        // state.dotCustomizedProducts.push(action.payload.data);

        state.message = action.payload.message;
      })
      .addCase(createDotCustomizedProduct.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      .addCase(fetchDotCustomizedProductByFilter.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchDotCustomizedProductByFilter.fulfilled, (state, action) => {
        state.dotCustomizedProducts = action.payload;
      })
      .addCase(fetchDotCustomizedProductByFilter.rejected, (state) => {
        state.loading = "rejected";
      })

      //Update dotProduct

      .addCase(updateDotCustomizedProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateDotCustomizedProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
        // const index = state.dotCustomizedProducts.findIndex(
        //   (dotProduct) => dotProduct._id === action.payload._id
        // );
        // if (index !== -1) {
        //   state.dotCustomizedProducts[index] = action.payload;
        // }
      })
      .addCase(updateDotCustomizedProduct.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete dotProduct
      .addCase(deleteDotCustomizedProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteDotCustomizedProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.deletedProductId = action.payload;
        // state.dotCustomizedProducts = state.dotCustomizedProducts.filter(
        //   (dotProduct) => dotProduct._id !== action.payload
        // );
      })
      .addCase(deleteDotCustomizedProduct.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default newDotCustomizedProductSlice.reducer;
