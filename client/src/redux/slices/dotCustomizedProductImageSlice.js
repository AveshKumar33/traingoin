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
//     "Content-Type": "multipart/form-data",
//     token: localStorage.getItem("token"),
//   },
// };

export const fetchDotCustomizedProductImage = createAsyncThunk(
  "dotCustomizedProductsImages/fetchDotCustomizedProductImage",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/customize-dot-product-image/${id}`
      );
      return data.data;
    } catch (error) {
      toastError(error.response.data.message);
    }
  }
);

export const fetchDotCustomizedProductImageDetails = createAsyncThunk(
  "dotCustomizedProductsImages/fetchDotCustomizedProductImageDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/customize-dot-product-image/obj/${id}`
      );
      return data.data;
    } catch (error) {
      toastError(error.response.data.message);
    }
  }
);

export const createDotCustomizedProductImage = createAsyncThunk(
  "dotproductImage/createDotCustomizedProductImage",
  async (dotproductdata) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/customize-dot-product-image`,
        dotproductdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        toastSuceess(data.message);
      }

      return data;
    } catch (error) {
      toastError(error.response.data.message);
    }
  }
);

export const updateDotCustomizedProductImage = createAsyncThunk(
  "dotCustomizedProductsImages/updateDotCustomizedProductImage",
  async ({ id, dotproductdata }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/customize-dot-product-image/${id}`,
        dotproductdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        toastSuceess(data.message);
      }

      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const deleteDotCustomizedProductImage = createAsyncThunk(
  "dotCustomizedProductsImages/deleteDotCustomizedProductImage",
  async (id) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/customize-dot-product-image/${id}`,
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

export const getDotCustomizedProductImageId = createAsyncThunk(
  "dotCustomizedProductsImages/getDotCustomizedProductImageId",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/customize-dot-product-image/obj/${id}`
      );

      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

const dotProductImageSlice = createSlice({
  name: "dotCustomizedProductsImages",
  initialState: {
    dotCustomizedProductsImages: [],
    totalData: 0,
    loading: "idle",
    error: null,
    success: false,
    message: "",
    dotCustomizedProductsImagesDetails: {},
    deletedDataId: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder

      //Get dotCustomizedProductsImages Details
      .addCase(fetchDotCustomizedProductImage.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchDotCustomizedProductImage.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.dotCustomizedProductsImages = action.payload;
      })
      .addCase(fetchDotCustomizedProductImage.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get dotCustomizedProductsImages Details
      .addCase(fetchDotCustomizedProductImageDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetchDotCustomizedProductImageDetails.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          state.dotCustomizedProductsImagesDetails = action.payload;
          // state.dotProductBundle = true
        }
      )
      .addCase(
        fetchDotCustomizedProductImageDetails.rejected,
        (state, action) => {
          state.loading = "rejected";
          state.error = action.error.message;
        }
      )

      //Get dotCustomizedProductsImages Details by _id
      .addCase(getDotCustomizedProductImageId.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getDotCustomizedProductImageId.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.dotCustomizedProductsImages = action.payload;
        // state.dotProductBundle = true
      })
      .addCase(getDotCustomizedProductImageId.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create dotProduct
      .addCase(createDotCustomizedProductImage.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createDotCustomizedProductImage.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
      })
      .addCase(createDotCustomizedProductImage.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update dotProduct
      .addCase(updateDotCustomizedProductImage.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateDotCustomizedProductImage.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
      })
      .addCase(updateDotCustomizedProductImage.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete dotProduct
      .addCase(deleteDotCustomizedProductImage.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteDotCustomizedProductImage.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.deletedDataId = action.payload;
      })
      .addCase(deleteDotCustomizedProductImage.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default dotProductImageSlice.reducer;
