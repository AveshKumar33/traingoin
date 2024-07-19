import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
// import { toastError } from "../../utils/reactToastify";

// const config = {
//   headers: {
//     "Content-Type": "application/json",
//     token: localStorage.getItem("token"),
//   },
// };

// const formdataconfig = {
//   headers: {
//     "Content-Type": "multipart/form-data",
//     token: localStorage.getItem("token"),
//   },
// };

export const fetchdotProductImageDetails = createAsyncThunk(
  "dotProductsImages/fetchdotProductImageDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/dot-product-image/${id}`);
      return data.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);

export const createdotProductImage = createAsyncThunk(
  "dotproductImage/createdotProductImage",
  async (dotproductdata) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/dot-product-image`,
        dotproductdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );
      return data;
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  }
);

export const updatedotProduct = createAsyncThunk(
  "dotProductsImages/updatedotProduct",
  async ({ id, dotproductdata }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/dot-product-image/${id}`,
        dotproductdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );
      return data.data;
    } catch (error) {
      console.log(error.response.data.message, "check this one");
    }
  }
);

/**delete dot product image slice */
export const deleteDotProductImage = createAsyncThunk(
  "dotProductsImages/deleteDotProductImage",
  async (id) => {
    await axiosInstance.delete(`/api/dot-product-image/${id}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    return id;
  }
);
export const getDotProductImageId = createAsyncThunk(
  "dotProductsImages/getDotProductImageId",
  async (id) => {
    const { data } = await axiosInstance.get(
      `/api/dot-product-image/obj/${id}`
    );
    return data.data;
  }
);

const dotProductImageSlice = createSlice({
  name: "dotProductsImages",
  initialState: {
    dotProductsImages: [],
    totalData: 0,
    loading: "idle",
    error: null,
    success: false,
    message: "",
    deletedData: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder

      //Get dotProductsImages Details
      .addCase(fetchdotProductImageDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchdotProductImageDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.dotProductsImages = action.payload;
        // state.dotProductBundle = true
      })
      .addCase(fetchdotProductImageDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })
      //Get dotProductsImages Details by _id
      .addCase(getDotProductImageId.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getDotProductImageId.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.dotProductsImages = action.payload;
        // state.dotProductBundle = true
      })
      .addCase(getDotProductImageId.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create dotProduct
      .addCase(createdotProductImage.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createdotProductImage.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
        state.dotProductsImages.push(action.payload.data);

        state.message = action.payload.message;
      })
      .addCase(createdotProductImage.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update dotProduct
      .addCase(updatedotProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updatedotProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
        const index = state.dotProductsImages.findIndex(
          (dotProduct) => dotProduct._id === action.payload._id
        );
        if (index !== -1) {
          state.dotProductsImages[index] = action.payload;
        }
      })
      .addCase(updatedotProduct.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete dotProduct
      .addCase(deleteDotProductImage.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteDotProductImage.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.deletedData = action.payload;
      })
      .addCase(deleteDotProductImage.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export const { addDotProductToCart } = dotProductImageSlice.actions;
export default dotProductImageSlice.reducer;
