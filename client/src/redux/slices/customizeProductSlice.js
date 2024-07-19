import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";

// const config = {
//   headers: {
//     "Content-Type": "application/json",
//   },
// };

// const formdataconfig = {
//   headers: {
//     "Content-Type": "multipart/form-data",
//     token: localStorage.getItem("token"),
//   },
// };

export const fetchCustomizedProduct = createAsyncThunk(
  "customizedproducts/fetchCustomizedProduct",
  async ({
    searchData = "",
    currentPage = 0,
    rowsPerPage = 0,
    SelectedIds = [],
  }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/customized-product?search=${searchData}&filter=${SelectedIds}&page=${
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
      toastError(error.response.data.message);
    }
  }
);

export const fetchCustomizedProductCombination = createAsyncThunk(
  "customizedproducts/fetchCustomizedProductCombination",
  async () => {
    try {
      const { data } = await axiosInstance.get(
        "/api/customized-product-combination/product-id"
      );

      return data?.data;
    } catch (error) {
      toastError(error.response.data.message);
    }
  }
);

export const fetchCustomizedProductDetails = createAsyncThunk(
  "customizedproducts/fetchCustomizedProductDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/customized-product/${id}`);
      return data.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);

export const fetchProductParametersAndPostions = createAsyncThunk(
  "customizedproducts/fetchProductParametersAndPostions",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/customized-product/all-details/${id}`
      );
      return data.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);

export const createCustomizedProduct = createAsyncThunk(
  "customizedproducts/createCustomizedProduct",

  async (customizeProductData) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/customized-product",
        customizeProductData,
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

export const updateCustomizedProduct = createAsyncThunk(
  "customizedproducts/updateCustomizedProduct",
  async ({ id, dotproductdata }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/customized-product/${id}`,
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

      return id;
    } catch (error) {
      toastError(error?.response?.data?.message);
      //   console.log(error.response.data.message);
    }
  }
);

export const createCustomizeProductCombination = createAsyncThunk(
  "customizedproducts/createCustomizeProductCombination",
  async (combinationData) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/customized-product-combination`,
        combinationData,
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
      //   console.log(error.response.data.message);
    }
  }
);

export const fetchCustomizeProductCombination = createAsyncThunk(
  "customizedproducts/fetchCustomizeProductCombination",
  async (productId) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/customized-product-combination/${productId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
      //   console.log(error.response.data.message);
    }
  }
);

// in backend found in customized product combination controller
export const fetchCustomizeProductWithCombinations = createAsyncThunk(
  "customizedproducts/fetchCustomizeProductWithCombinations",
  async (productId) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/customized-product-combination/combination/${productId}`,
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

// in backend found in customized product combination controller by url
export const fetchCustomizeProductWithCombinationsByUrl = createAsyncThunk(
  "customizedproducts/fetchCustomizeProductWithCombinationsByUrl",
  async (productUrl) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/customized-product-combination/combination/url/${productUrl}`,
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

export const deleteCustomizedproduct = createAsyncThunk(
  "customizedproducts/deleteCustomizedproduct",
  async (customizeProductId) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/customized-product/${customizeProductId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data?.success) {
        toastSuceess(data?.message);
      }
      return customizeProductId;
    } catch (error) {
      toastError(error?.response?.data?.message);
      //   console.log(error.response.data.message);
    }
  }
);

const customizedProductSlice = createSlice({
  name: "customizedproducts",
  initialState: {
    customizedproducts: [],
    loading: "idle",
    error: null,
    success: false,
    message: "",
    totalCount: 0,
    customizeProductdetails: {},
    productParameterAndPositions: [],
    customizeProductCombination: {},
    productCombinationDetails: {},
    deletedProductId: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get customizedproducts
      .addCase(fetchCustomizedProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCustomizedProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        // state.success = true;
        state.customizedproducts = action.payload?.data;
        state.totalCount = action.payload?.totalCount;
      })
      .addCase(fetchCustomizedProduct.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //fetch Customize Product Combination
      .addCase(fetchCustomizeProductCombination.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCustomizeProductCombination.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        // state.success = true;
        state.customizeProductCombination = action.payload;
      })
      .addCase(fetchCustomizeProductCombination.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //fetch Customize Product Combination by Id
      .addCase(fetchCustomizeProductWithCombinations.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetchCustomizeProductWithCombinations.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          // state.success = true;
          state.productCombinationDetails = action.payload;
        }
      )
      .addCase(
        fetchCustomizeProductWithCombinations.rejected,
        (state, action) => {
          state.loading = "rejected";
          state.error = action.error.message;
        }
      )

      //fetch Customize Product Combination by URL
      .addCase(fetchCustomizeProductWithCombinationsByUrl.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetchCustomizeProductWithCombinationsByUrl.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          state.productCombinationDetails = action.payload;
        }
      )
      .addCase(fetchCustomizeProductWithCombinationsByUrl.rejected, (state) => {
        state.loading = "rejected";
      })

      //Get customizedproducts Details
      .addCase(fetchCustomizedProductDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCustomizedProductDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.customizeProductdetails = action.payload;
        // state.dotProductBundle = true
      })
      .addCase(fetchCustomizedProductDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      .addCase(fetchProductParametersAndPostions.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchProductParametersAndPostions.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productParameterAndPositions = action.payload;
        // state.dotProductBundle = true
      })
      .addCase(fetchProductParametersAndPostions.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create dotProduct

      .addCase(createCustomizedProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createCustomizedProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        // state.success = true;
        state.message = action.payload.message;
      })
      .addCase(createCustomizedProduct.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //create Customize Product Combination
      .addCase(createCustomizeProductCombination.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createCustomizeProductCombination.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(createCustomizeProductCombination.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update dotProduct

      .addCase(updateCustomizedProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateCustomizedProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.deletedProductId = action.payload;
        // const index = state.customizedproducts.findIndex(
        //   (dotProduct) => dotProduct._id === action.payload._id
        // );
        // if (index !== -1) {
        //   state.customizedproducts[index] = action.payload;
        // }
      })
      .addCase(updateCustomizedProduct.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete dotProduct

      .addCase(deleteCustomizedproduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteCustomizedproduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.deletedProductId = action.payload;
      })

      .addCase(deleteCustomizedproduct.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default customizedProductSlice.reducer;
