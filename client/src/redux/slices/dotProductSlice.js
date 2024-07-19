import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError } from "../../utils/reactToastify";

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

export const fetchdotProduct = createAsyncThunk(
  "dotproducts/fetchdotProduct",
  async () => {
    try {
      const { data } = await axiosInstance.get("/api/dotbundleproduct");
      // const { data } = await axiosInstance.post("/api/dotbundleproduct/filterByTag",{
      //   Tags
      // });

      return data.data;
    } catch (error) {
      console.log("running", error);
      toastError(error.response.data.message);
    }
  }
);
export const fetchDotProductByFilter = createAsyncThunk(
  "dotproducts/fetchDotProductByFilter",
  async ({ Tags }) => {
    try {
      console.log("running dot product", Tags);

      const { data } = await axiosInstance.post(
        "/api/dotbundleproduct/filterByTag",
        { Tags }
      );
      console.log(data.data, "data.datadata.data");
      return data.data;
    } catch (error) {
      console.log("running", error);
      toastError(error.response.data.message);
    }
  }
);

export const fetchdotProductDetails = createAsyncThunk(
  "dotproducts/fetchdotProductDetails",
  async (id) => {
    //sss
    try {
      const { data } = await axiosInstance.get(`/api/dotbundleproduct/${id}`);
      console.log(data, "check ravi");
      return data.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);

export const createdotProduct = createAsyncThunk(
  "dotproducts/createdotProduct",
  async (dotproductdata) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/dotbundleproduct",
        dotproductdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );
      // const response = await axios.post("http://localhost:7000/api/dotbundleproduct", dotproductdata);
      return data;
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  }
);

export const updatedotProduct = createAsyncThunk(
  "dotproducts/updatedotProduct",
  async ({ id, dotproductdata }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/dotbundleproduct/${id}`,
        dotproductdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );
      console.log(data, "datadata");
      return data.data;
    } catch (error) {
      console.log(error.response.data.message, "check this one");
    }
  }
);

export const dotProduct = createAsyncThunk(
  "dotproducts/dotProduct",
  async (dotProductId) => {
    await axiosInstance.delete(`/api/dotbundleproduct/${dotProductId}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    return dotProductId;
  }
);

const dotproductslice = createSlice({
  name: "dotproducts",
  initialState: {
    dotproducts: [],
    loading: "idle",
    error: null,
    success: false,
    message: "",
    dotProductdetails: {},
    dotProductBundleData: [],
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
        state.dotproducts = action.payload;
      })
      .addCase(fetchdotProduct.rejected, (state, action) => {
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
      .addCase(fetchDotProductByFilter.fulfilled, (state, action) => {
        // console.log("check this product action: ", action.payload);
        state.dotproducts = action.payload;
      })
      //Update dotProduct

      .addCase(updatedotProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updatedotProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
        if (state?.dotproducts?.length > 0) {
          const index = state?.dotproducts?.findIndex(
            (dotProduct) => dotProduct?._id === action?.payload?._id
          );

          if (index !== -1) {
            state.dotproducts[index] = action.payload;
          }
        }
      })
      .addCase(updatedotProduct.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete dotProduct
      .addCase(dotProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(dotProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.dotproducts = state.dotproducts.filter(
          (dotProduct) => dotProduct._id !== action.payload
        );
      })
      .addCase(dotProduct.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export const { addDotProductToCart } = dotproductslice.actions;

export default dotproductslice.reducer;
