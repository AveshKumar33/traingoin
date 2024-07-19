import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError } from "../../utils/reactToastify";

// specific for single products
export const fetchWishlistProducts = createAsyncThunk(
  "wishlist/fetchWishlistProducts",
  async ({ product, userId }) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/wishlist/single-product/all/${userId}`,
        product
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchWishlistSingleProducts = createAsyncThunk(
  "wishlist/fetchWishlistSingleProducts",
  async ({ userId }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/wishlist/single-product-wishlist/all/${userId}`
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchDotProductsWishlist = createAsyncThunk(
  "wishlist/fetchDotProductsWishlist",
  async ({ userId }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/wishlist/dot-product-wishlist/all/${userId}`
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchCustomizedProductsWishlist = createAsyncThunk(
  "wishlist/fetchCustomizedProductsWishlist",
  async ({ userId }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/wishlist/customized-product-wishlist/all/${userId}`
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchCustomizedComboProductsWishlist = createAsyncThunk(
  "wishlist/fetchCustomizedComboProductsWishlist",
  async ({ userId }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/wishlist/customized-combo-wishlist/all/${userId}`
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

// specific for Dot products
export const fetchWishlistDotProducts = createAsyncThunk(
  "wishlist/fetchWishlistDotProducts",
  async ({ product, userId }) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/wishlist/dot-product/all/${userId}`,
        product
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

// specific for Customized products
export const fetchWishlistCustomizedProducts = createAsyncThunk(
  "wishlist/fetchWishlistCustomizedProducts",
  async ({ product, userId }) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/wishlist/customized-product/all/${userId}`,
        product
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

// specific for Customized Combo products
export const fetcCustomizedComboProductsForWishlist = createAsyncThunk(
  "wishlist/fetcCustomizedComboProductsForWishlist",
  async ({ product, userId }) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/wishlist/customized-combo/wishlist-all/${userId}`,
        product
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

// specific for Customized Combo products
export const fetchWishlistCustomizedComboProductById = createAsyncThunk(
  "wishlist/fetchWishlistCustomizedComboProductById",
  async ({ product, userId, id }) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/wishlist/customized-combo/${id}/${userId}`,
        product
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchWishlistCustomizedComboProducts = createAsyncThunk(
  "wishlist/fetchWishlistCustomizedComboProducts",
  async ({ userId }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/wishlist/customized-combo/all/${userId}`
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

// specific for Customized products
export const fetchWishlistCustomizedProductsById = createAsyncThunk(
  "wishlist/fetchWishlistCustomizedProductsById",
  async ({ id, product, userId }) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/wishlist/product/${id}/${userId}`,
        product
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

// specific for Customized products
export const fetchWishlistCustomizedProductsByWishlistId = createAsyncThunk(
  "wishlist/fetchWishlistCustomizedProductsByWishlistId",
  async ({ id }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/wishlist/customized-product-wishlist/${id}`
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchWishlistForProductList = createAsyncThunk(
  "wishlist/fetchWishlistForProductList",
  async () => {
    try {
      const { data } = await axiosInstance.get(`/api/wishlist/for-list`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (product) => {
    try {
      const { data } = await axiosInstance.post("/api/wishlist", product, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      //   if (data?.success) {
      //     toastSuceess(data?.message);
      //   }

      return data;
    } catch (error) {
      if (error?.message) {
        toastError(error?.message);
      } else if (error?.response?.data?.message) {
        toastError(error?.response?.data?.message);
      } else {
        console.log(error);
      }
    }
  }
);

export const addLocalStorageWishlistProduct = createAsyncThunk(
  "wishlist/addLocalStorageWishlistProduct",
  async (product) => {
    try {
      const { data } = await axiosInstance.post("/api/wishlist/all", product, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      //   if (data?.success) {
      //     toastSuceess(data?.message);
      //   }

      return data;
    } catch (error) {
      if (error?.message) {
        toastError(error?.message);
      } else if (error?.response?.data?.message) {
        toastError(error?.response?.data?.message);
      } else {
        console.log(error);
      }
    }
  }
);

export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (product) => {
    try {
      const { data } = await axiosInstance.post("/api/wishlist", product, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      return data;
    } catch (error) {
      if (error?.message) {
        toastError(error?.message);
      } else if (error?.response?.data?.message) {
        toastError(error?.response?.data?.message);
      } else {
        console.log(error);
      }
    }
  }
);

export const getWishlistProductById = createAsyncThunk(
  "wishlist/getWishlistProductById",
  async ({ id, searchProduct }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/wishlist/product/${id}?search=${searchProduct}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      return data;
    } catch (error) {
      if (error?.message) {
        toastError(error?.message);
      } else if (error?.response?.data?.message) {
        toastError(error?.response?.data?.message);
      } else {
        console.log(error);
      }
    }
  }
);

export const getSingleProductByWishlistId = createAsyncThunk(
  "wishlist/getSingleProductByWishlistId",
  async ({ id }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/wishlist/single-product-wishlist/${id}`
      );

      return data;
    } catch (error) {
      if (error?.message) {
        toastError(error?.message);
      } else if (error?.response?.data?.message) {
        toastError(error?.response?.data?.message);
      } else {
        console.log(error);
      }
    }
  }
);

export const getWishlistProductCount = createAsyncThunk(
  "wishlist/getWishlistProductCount",
  async () => {
    try {
      const { data } = await axiosInstance.get("/api/wishlist/count", {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      return data;
    } catch (error) {
      if (error?.message) {
        toastError(error?.message);
      } else if (error?.response?.data?.message) {
        toastError(error?.response?.data?.message);
      } else {
        console.log(error);
      }
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/api/wishlist/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      //   if (data?.success) {
      //     toastSuceess(data?.message);
      //   }

      return data;
    } catch (error) {
      if (error?.message) {
        toastError(error?.message);
      } else if (error?.response?.data?.message) {
        toastError(error?.response?.data?.message);
      } else {
        console.log(error);
      }
    }
  }
);

const newWishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlistProducts: [],
    wishlistDotProducts: [],
    wishlistCustomizedProducts: [],
    wishlistCustomizedComboProducts: [],
    wishlistProductDetails: [],
    products: [],
    dotProducts: [],
    customizedProducts: [],
    customizedComboProducts: [],
    customizedComboProductById: [],
    customizedComboForWishlist: [],
    singleProductWishlist: [],
    dotProductWishlist: [],
    customizedProductWishlist: [],
    customizedComboWishlist: [],
    customizedCombo: [],
    customizedWishlistProduct: [],
    singleWishlistProduct: [],
    wishlistProduct: null,
    count: 0,
    loading: "idle",
    singleProductLoading: "idle",
    dotProductLoading: "idle",
    customizeProductLoading: "idle",
    comboProductLoading: "idle",
    error: null,
    message: "",
    status: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get Products
      .addCase(fetchWishlistProducts.pending, (state) => {
        state.loading = "pending";
        state.singleProductLoading = "pending";
      })
      .addCase(fetchWishlistProducts.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.singleProductLoading = "fulfilled";
        state.wishlistProducts = action?.payload?.data;
        state.products = action?.payload?.products;
      })
      .addCase(fetchWishlistProducts.rejected, (state, action) => {
        state.loading = "rejected";
        state.singleProductLoading = "rejected";
        state.error = action.error.message;
      })

      //Get Products
      .addCase(fetchWishlistDotProducts.pending, (state) => {
        state.loading = "pending";
        state.dotProductLoading = "pending";
      })
      .addCase(fetchWishlistDotProducts.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.dotProductLoading = "fulfilled";
        state.wishlistDotProducts = action?.payload?.data;
        state.dotProducts = action?.payload?.products;
      })
      .addCase(fetchWishlistDotProducts.rejected, (state, action) => {
        state.loading = "rejected";
        state.dotProductLoading = "rejected";
        state.error = action.error.message;
      })

      //Get Products
      .addCase(fetcCustomizedComboProductsForWishlist.pending, (state) => {
        state.loading = "pending";
        state.comboProductLoading = "pending";
      })
      .addCase(
        fetcCustomizedComboProductsForWishlist.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          state.comboProductLoading = "fulfilled";
          state.wishlistCustomizedComboProducts = action?.payload?.data;
          state.customizedComboForWishlist = action?.payload?.products;
        }
      )
      .addCase(
        fetcCustomizedComboProductsForWishlist.rejected,
        (state, action) => {
          state.loading = "rejected";
          state.comboProductLoading = "rejected";
          state.error = action.error.message;
        }
      )

      //Get Products
      .addCase(fetchWishlistCustomizedComboProductById.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetchWishlistCustomizedComboProductById.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          state.customizedComboProductById = action?.payload?.data;
        }
      )
      .addCase(
        fetchWishlistCustomizedComboProductById.rejected,
        (state, action) => {
          state.loading = "rejected";
          state.error = action.error.message;
        }
      )

      //Get Products
      .addCase(fetchWishlistCustomizedProducts.pending, (state) => {
        state.loading = "pending";
        state.customizeProductLoading = "pending";
      })
      .addCase(fetchWishlistCustomizedProducts.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.customizeProductLoading = "fulfilled";
        state.wishlistCustomizedProducts = action?.payload?.data;
        state.customizedProducts = action?.payload?.products;
      })
      .addCase(fetchWishlistCustomizedProducts.rejected, (state, action) => {
        state.loading = "rejected";
        state.customizeProductLoading = "rejected";
        state.error = action.error.message;
      })

      //Get Products
      .addCase(fetchWishlistCustomizedComboProducts.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetchWishlistCustomizedComboProducts.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          state.customizedComboProducts = action?.payload?.data;
        }
      )
      .addCase(
        fetchWishlistCustomizedComboProducts.rejected,
        (state, action) => {
          state.loading = "rejected";
          state.error = action.error.message;
        }
      )

      //Get Products
      .addCase(fetchWishlistForProductList.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchWishlistForProductList.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.wishlistProducts = action?.payload?.data;
      })
      .addCase(fetchWishlistForProductList.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get Products
      .addCase(getWishlistProductById.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getWishlistProductById.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.wishlistProductDetails = action?.payload?.data;
      })
      .addCase(getWishlistProductById.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get Products
      .addCase(getSingleProductByWishlistId.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getSingleProductByWishlistId.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.singleWishlistProduct = action?.payload?.data;
      })
      .addCase(getSingleProductByWishlistId.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get Single Product wishlist
      .addCase(fetchWishlistSingleProducts.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchWishlistSingleProducts.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.singleProductWishlist = action?.payload?.data;
      })
      .addCase(fetchWishlistSingleProducts.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get Dot Product wishlist
      .addCase(fetchDotProductsWishlist.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchDotProductsWishlist.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.dotProductWishlist = action?.payload?.data;
      })
      .addCase(fetchDotProductsWishlist.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get customized Product wishlist
      .addCase(fetchCustomizedProductsWishlist.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCustomizedProductsWishlist.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.customizedProductWishlist = action?.payload?.data;
      })
      .addCase(fetchCustomizedProductsWishlist.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get customized Combo Product wishlist
      .addCase(fetchCustomizedComboProductsWishlist.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetchCustomizedComboProductsWishlist.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          state.customizedComboWishlist = action?.payload?.data;
        }
      )
      .addCase(
        fetchCustomizedComboProductsWishlist.rejected,
        (state, action) => {
          state.loading = "rejected";
          state.error = action.error.message;
        }
      )

      //Get Products
      .addCase(fetchWishlistCustomizedProductsById.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetchWishlistCustomizedProductsById.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          state.wishlistProductDetails = action?.payload?.data;
        }
      )
      .addCase(
        fetchWishlistCustomizedProductsById.rejected,
        (state, action) => {
          state.loading = "rejected";
          state.error = action.error.message;
        }
      )

      //Get Products
      .addCase(fetchWishlistCustomizedProductsByWishlistId.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetchWishlistCustomizedProductsByWishlistId.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          state.customizedWishlistProduct = action?.payload?.data;
        }
      )
      .addCase(
        fetchWishlistCustomizedProductsByWishlistId.rejected,
        (state, action) => {
          state.loading = "rejected";
          state.error = action.error.message;
        }
      )

      //Get Wishlist Product Count
      .addCase(getWishlistProductCount.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getWishlistProductCount.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.count = action?.payload?.data;
      })
      .addCase(getWishlistProductCount.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create Product
      .addCase(addToWishlist.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.message = action?.payload?.message;
        state.wishlistProduct = action?.payload?.data;
        state.status = action?.payload?.success;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Add LocalStorage Wishlist Product
      .addCase(addLocalStorageWishlistProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addLocalStorageWishlistProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.message = action?.payload?.message;
        state.status = action?.payload?.success;
      })
      .addCase(addLocalStorageWishlistProduct.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create Product
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.wishlistProduct = null;
        state.message = action?.payload?.message;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      });
  },
});

export default newWishlistSlice.reducer;
