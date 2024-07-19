import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";

// const config = {
//   headers: {
//     "Content-Type": "application/json",
//   },
// };

export const fetchProductBundle = createAsyncThunk(
  "productBundle/fetchProductBundle",
  async () => {
    const { data } = await axiosInstance.get("/api/productbundle");
    return data.data;
  }
);

export const fetchProductBundleDetails = createAsyncThunk(
  "productBundle/fetchProductBundleDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/productbundle/${id}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
      //   console.log(error.response.data.message);
    }
  }
);

export const createProductBundle = createAsyncThunk(
  "productBundle/createProductBundle",
  async (productBundledata, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/productbundle",
        productBundledata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );
      // const response = await axios.post("http://localhost:7000/api/productbundle", productBundledata);
      return data.data;
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateProductBundle = createAsyncThunk(
  "productBundle/updateProductBundle",
  async ({ id, productBundledata }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/productbundle/${id}`,
        productBundledata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);

      //   console.log(error.response.data.message);
    }
  }
);

export const deleteProductBundle = createAsyncThunk(
  "productBundle/deleteProductBundle",
  async (productBundleId) => {
    alert(productBundleId);
    alert("bundle", productBundleId);
    await axiosInstance.delete(`/api/productbundle/${productBundleId}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    return productBundleId;
  }
);

const productBundleSlice = createSlice({
  name: "productBundle",
  initialState: {
    productBundle: [],
    loading: "idle",
    error: null,
    success: false,
    message: "",
    productBundledetails: {},
    bundledata: [],
  },
  reducers: {
    addToBundle: (state, action) => {
      console.log("checkbundledata", state.bundledata);

      // const checkbundledata = JSON.parse(JSON.stringify(state.bundledata));

      // let { name, quantity, price, img, sellingType, Installment, ...rest } = {
      //   ...action.payload.product,
      // };

      // const isItemExist = findObjectFromArray(
      //   rest,
      //   checkbundledata
      // );

      // if (isItemExist) {
      //   // const existingbundledata = JSON.parse(JSON.stringify(state.bundledata));
      //   const existingdata = checkbundledata.map((s) =>
      //     s === isItemExist ? action.payload.product : s
      //   );
      //   state.bundledata = existingdata;
      // } else {
      //   state.bundledata.push(action.payload.product);

      // }
    },

    removeToBundle: (state, action) => {
      const checkbundledata = JSON.parse(JSON.stringify(state.bundledata));
      const filtereddata = checkbundledata.filter(
        (i) => JSON.stringify(i) !== JSON.stringify(action.payload.item)
      );
      state.bundledata = filtereddata;
    },

    resetBundle: (state) => {
      state.bundledata = [];
    },
  },
  extraReducers: (builder) => {
    builder
      //Get productBundle
      .addCase(fetchProductBundle.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchProductBundle.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productBundle = action.payload;
      })
      .addCase(fetchProductBundle.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get productBundle Details

      .addCase(fetchProductBundleDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchProductBundleDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productBundledetails = action.payload;
      })
      .addCase(fetchProductBundleDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      })

      //Create productBundle

      .addCase(createProductBundle.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createProductBundle.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productBundle.push(action.payload.data);
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(createProductBundle.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      })

      //Update productBundle
      .addCase(updateProductBundle.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateProductBundle.fulfilled, (state, action) => {
        const index = state.productBundle.findIndex(
          (productBundle) => productBundle._id === action.payload._id
        );
        if (index !== -1) {
          state.productBundle[index] = action.payload;
        }
      })
      .addCase(updateProductBundle.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      })

      //Delete productBundle
      .addCase(deleteProductBundle.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteProductBundle.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.productBundle = state.productBundle.filter(
          (bundle) => bundle._id !== action.payload
        );
      })
      .addCase(deleteProductBundle.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      });
  },
});

export const { addToBundle, removeToBundle, resetBundle } =
  productBundleSlice.actions;

export default productBundleSlice.reducer;
