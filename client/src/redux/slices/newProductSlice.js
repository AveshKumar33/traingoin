import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";
// import { redirect } from "react-router-dom";

// const config = {
//   headers: {
//     token: localStorage.getItem("token"),
//   },
// };

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({
    searchData = "",
    currentPage = 0,
    rowsPerPage = 0,
    SelectedIds = [],
  }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/product-new?filter=isSingleProduct&search=${searchData}&category=${SelectedIds}&page=${
          currentPage + 1
        }&limit=${rowsPerPage}`
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

/**fetch all dot products having product id  */
export const fetchdotProductDetailsByProductId = createAsyncThunk(
  "dotproducts/fetchdotProductDetailsByProductId",
  async (pId) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/product-new/product-id/${pId}`
      );
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async () => {
    try {
      const { data } = await axiosInstance.get(`/api/product-new/all`);

      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchProductsForBundle = createAsyncThunk(
  "products/fetchProductsForBundle",
  async () => {
    try {
      const { data } = await axiosInstance.get("/api/product-new");
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchCustomizedProducts = createAsyncThunk(
  "api/products-new/fetchCustomizedProducts",
  async () => {
    try {
      const { data } = await axiosInstance.get(
        "/api/product-new?filter=isCustomizeProduct"
      );

      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchProductsDetails = createAsyncThunk(
  "products/fetchProductsDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/product/${id}`);

      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchProductsDetailsByUrl = createAsyncThunk(
  "products/fetchProductsDetailsByUrl",
  async (productname) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/product-new/url-handle/${productname}`,
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

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productdata) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/product-new",
        productdata,
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

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productdata }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/product/${id}`,
        productdata,
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

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/product-new/${productId}`,
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
      if (error.response && error.response.data.message) {
        toastError(error.response.data.message);
        // alert(error.response.data.message);
        return rejectWithValue(error.response.data.message);
      } else {
        toastError(error.message);
        return rejectWithValue(error.message);
      }
    }
  }
);

const newProductSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    totalData: 0,
    loading: "idle",
    error: null,
    allDotproducts: [],
    message: "",
    productdetails: {},
    deletedProductId: null,
    productCombinations: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.products = action?.payload?.data;
        state.totalData = action?.payload?.totalCount;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get all Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      /**fetch all dot dot products by product id */
      .addCase(fetchdotProductDetailsByProductId.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchdotProductDetailsByProductId.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.allDotproducts = action.payload;
      })
      .addCase(fetchdotProductDetailsByProductId.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })
      //Get Products For Bundle
      .addCase(fetchProductsForBundle.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchProductsForBundle.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.products = action.payload;
      })
      .addCase(fetchProductsForBundle.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get Products Details

      .addCase(fetchProductsDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchProductsDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productdetails = action.payload;
      })
      .addCase(fetchProductsDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Fetch product by url
      .addCase(fetchProductsDetailsByUrl.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchProductsDetailsByUrl.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productCombinations = action.payload.productCombinations;
        state.productdetails = action.payload.data;
      })
      .addCase(fetchProductsDetailsByUrl.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.deletedProductId = action.payload;
      })

      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      })

      // get fetchCustomizedProducts
      .addCase(fetchCustomizedProducts.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCustomizedProducts.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.products = action.payload;
      })
      .addCase(fetchCustomizedProducts.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      });
  },
});

export default newProductSlice.reducer;
