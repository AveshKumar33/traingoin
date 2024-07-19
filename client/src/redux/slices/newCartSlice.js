import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError } from "../../utils/reactToastify";

// specific for single products
export const fetchCartSingleProducts = createAsyncThunk(
  "cart/fetchCartSingleProducts",
  async ({ product, userId }) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/cart/product/single-product/${userId}`,
        product
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);
// specific for cart products
export const fetchCartProductById = createAsyncThunk(
  "cart/fetchCartProductById",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/cart/get-cart-item/${id}`);
      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);
// specific for cart products
export const fetchCustomizetProductCombinationById = createAsyncThunk(
  "cart/fetchCustomizetProductCombinationById",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/cart/get-cart-customize-combination/${id}`
      );
      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

// specific for Customized products
export const fetchCartCustomizedProducts = createAsyncThunk(
  "cart/fetchCartCustomizedProducts",
  async ({ product, userId }) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/cart/product/customized-product/${userId}`,
        product
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

// specific for Customized products
export const fetchCartDotProducts = createAsyncThunk(
  "cart/fetchCartDotProducts",
  async ({ product, userId }) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/cart/product/dot-product/${userId}`,
        product
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

// specific for Customized Combo products
export const fetchCartCustomizedComboProducts = createAsyncThunk(
  "cart/fetchCartCustomizedComboProducts",
  async ({ product, userId }) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/cart/product/customized-combo/${userId}`,
        product
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const addToCart = createAsyncThunk("cart/addToCart", async (product) => {
  try {
    const { data } = await axiosInstance.post("/api/cart", product, {
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
});

export const addLocalStorageCartProduct = createAsyncThunk(
  "cart/addLocalStorageCartProduct",
  async (product) => {
    try {
      const { data } = await axiosInstance.post("/api/cart/all", product, {
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

export const getCartSingleProduct = createAsyncThunk(
  "wishlist/getCartSingleProduct",
  async ({ id, productId = "null" }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/cart/single-product/${id}/${productId}`,
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

export const getCartCustomizeProduct = createAsyncThunk(
  "wishlist/getCartCustomizeProduct",
  async ({ id, productId = "null" }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/cart/customize-product/${id}/${productId}`,
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

export const getCartSingleDotProduct = createAsyncThunk(
  "wishlist/getCartSingleDotProduct",
  async ({ id, productId = "null" }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/cart/single-dot-product/${id}/${productId}`,
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

export const getCartCustomizeDotProduct = createAsyncThunk(
  "wishlist/getCartCustomizeDotProduct",
  async ({ id, productId = "null" }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/cart/customize-dot-product/${id}/${productId}`,
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

export const getCartCustomizeComboProduct = createAsyncThunk(
  "wishlist/getCartCustomizeComboProduct",
  async ({ id, productId = "null" }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/cart/customize-combo-product/${id}/${productId}`,
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

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
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

export const updateCartProductQuantity = createAsyncThunk(
  "cart/updateCartProductQuantity",
  async ({ id, productData }) => {
    try {
      const { data } = await axiosInstance.put(`/api/cart/${id}`, productData, {
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

export const deleteFromCart = createAsyncThunk(
  "wishlist/deleteFromCart",
  async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/api/cart/${id}`, {
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

export const cartProductMoveToWishlist = createAsyncThunk(
  "wishlist/cartProductMoveToWishlist",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/cart/move/${id}`, {
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

const newCartSlice = createSlice({
  name: "cart",
  initialState: {
    loading: "idle",
    addedCartProduct: null,
    singleProduct: [],
    customizeProduct: [],
    cartSingleProduct: [],
    cartCustomizeProduct: [],
    cartDotProduct: [],
    dotProduct: [],
    cartItem: {},
    customizedComboProduct: [],
    cartCustomizeComboProduct: [],
    updatedData: null,
    singleProductLoading: "idle",
    customizeProductLoading: "idle",
    cartSingleLoading: "idle",
    cartCustomizeProductLoading: "idle",
    cartCustomizeComboProductLoading: "idle",
    cartDotProductLoading: "idle",
    dotProductLoading: "idle",
    customizedComboProductLoading: "idle",
    message: "",
  },
  reducers: {
    resetData: (state) => {
      state.addedCartProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //fetch cart single Product
      .addCase(fetchCartSingleProducts.pending, (state) => {
        state.singleProductLoading = "pending";
      })
      .addCase(fetchCartSingleProducts.fulfilled, (state, action) => {
        state.singleProductLoading = "fulfilled";
        state.singleProduct = action?.payload?.data;
      })
      .addCase(fetchCartSingleProducts.rejected, (state, action) => {
        state.singleProductLoading = "rejected";
        state.error = action.error.message;
      })
      //fetch cart Product by _id
      .addCase(fetchCartProductById.pending, (state) => {
        state.singleProductLoading = "pending";
      })
      .addCase(fetchCartProductById.fulfilled, (state, action) => {
        state.singleProductLoading = "fulfilled";
        const cartData = action?.payload?.data;
        state.cartItem = cartData[0];
      })
      .addCase(fetchCartProductById.rejected, (state, action) => {
        state.singleProductLoading = "rejected";
        state.error = action.error.message;
      })
      //fetch cart Product by _id
      .addCase(fetchCustomizetProductCombinationById.pending, (state) => {
        state.singleProductLoading = "pending";
      })
      .addCase(
        fetchCustomizetProductCombinationById.fulfilled,
        (state, action) => {
          state.singleProductLoading = "fulfilled";
          state.cartItem = action?.payload?.data;
        }
      )
      .addCase(
        fetchCustomizetProductCombinationById.rejected,
        (state, action) => {
          state.singleProductLoading = "rejected";
          state.error = action.error.message;
        }
      )

      // customize
      .addCase(fetchCartCustomizedProducts.pending, (state) => {
        state.customizeProductLoading = "pending";
      })
      .addCase(fetchCartCustomizedProducts.fulfilled, (state, action) => {
        state.customizeProductLoading = "fulfilled";
        state.customizeProduct = action?.payload?.data;
      })
      .addCase(fetchCartCustomizedProducts.rejected, (state, action) => {
        state.customizeProductLoading = "rejected";
        state.error = action.error.message;
      })

      // dot
      .addCase(fetchCartDotProducts.pending, (state) => {
        state.dotProductLoading = "pending";
      })
      .addCase(fetchCartDotProducts.fulfilled, (state, action) => {
        state.dotProductLoading = "fulfilled";
        state.dotProduct = action?.payload?.data;
        state.cartDotProduct = action?.payload?.cartData;
      })
      .addCase(fetchCartDotProducts.rejected, (state, action) => {
        state.dotProductLoading = "rejected";
        state.error = action.error.message;
      })

      // dot
      .addCase(fetchCartCustomizedComboProducts.pending, (state) => {
        state.customizedComboProductLoading = "pending";
      })
      .addCase(fetchCartCustomizedComboProducts.fulfilled, (state, action) => {
        state.customizedComboProductLoading = "fulfilled";
        state.customizedComboProduct = action?.payload?.data;
      })
      .addCase(fetchCartCustomizedComboProducts.rejected, (state, action) => {
        state.customizedComboProductLoading = "rejected";
        state.error = action.error.message;
      })

      //add To cart Product
      .addCase(addToCart.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.addedCartProduct = action?.payload?.data;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //add To cart Product
      .addCase(getCartSingleProduct.pending, (state) => {
        state.cartSingleLoading = "pending";
      })
      .addCase(getCartSingleProduct.fulfilled, (state, action) => {
        state.cartSingleLoading = "fulfilled";
        state.cartSingleProduct = action?.payload?.data;
      })
      .addCase(getCartSingleProduct.rejected, (state, action) => {
        state.cartSingleLoading = "rejected";
        state.error = action.error.message;
      })

      //add To cart Product
      .addCase(getCartCustomizeProduct.pending, (state) => {
        state.cartCustomizeProductLoading = "pending";
      })
      .addCase(getCartCustomizeProduct.fulfilled, (state, action) => {
        state.cartCustomizeProductLoading = "fulfilled";
        state.cartCustomizeProduct = action?.payload?.data;
      })
      .addCase(getCartCustomizeProduct.rejected, (state, action) => {
        state.cartCustomizeProductLoading = "rejected";
        state.error = action.error.message;
      })

      // cart single dot Product
      .addCase(getCartSingleDotProduct.pending, (state) => {
        state.cartDotProductLoading = "pending";
      })
      .addCase(getCartSingleDotProduct.fulfilled, (state, action) => {
        state.cartDotProductLoading = "fulfilled";
        state.cartDotProduct = action?.payload?.data;
      })
      .addCase(getCartSingleDotProduct.rejected, (state, action) => {
        state.cartDotProductLoading = "rejected";
        state.error = action.error.message;
      })

      // cart customize dot Product
      .addCase(getCartCustomizeDotProduct.pending, (state) => {
        state.cartDotProductLoading = "pending";
      })
      .addCase(getCartCustomizeDotProduct.fulfilled, (state, action) => {
        state.cartDotProductLoading = "fulfilled";
        state.cartDotProduct = action?.payload?.data;
      })
      .addCase(getCartCustomizeDotProduct.rejected, (state, action) => {
        state.cartDotProductLoading = "rejected";
        state.error = action.error.message;
      })

      // cart customize combo Product
      .addCase(getCartCustomizeComboProduct.pending, (state) => {
        state.cartCustomizeComboProductLoading = "pending";
      })
      .addCase(getCartCustomizeComboProduct.fulfilled, (state, action) => {
        state.cartCustomizeComboProductLoading = "fulfilled";
        state.cartCustomizeComboProduct = action?.payload?.data;
      })
      .addCase(getCartCustomizeComboProduct.rejected, (state, action) => {
        state.cartCustomizeComboProductLoading = "rejected";
        state.error = action.error.message;
      })

      //Add LocalStorage cart Product
      .addCase(addLocalStorageCartProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addLocalStorageCartProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.message = action?.payload?.message;
      })
      .addCase(addLocalStorageCartProduct.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create Product
      .addCase(deleteFromCart.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteFromCart.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.message = action?.payload?.message;
      })
      .addCase(deleteFromCart.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //update Product
      .addCase(updateCartProductQuantity.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateCartProductQuantity.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.updatedData = action?.payload?.data;
      })
      .addCase(updateCartProductQuantity.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //move Product
      .addCase(cartProductMoveToWishlist.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(cartProductMoveToWishlist.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(cartProductMoveToWishlist.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      });
  },
});

export const newCartSiliceAction = newCartSlice.actions;
export default newCartSlice.reducer;
