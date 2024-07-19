import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError } from "../../utils/reactToastify";

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

export const fetchdotCustomizedProduct = createAsyncThunk(
  "dotCustomizedproducts/fetchdotCustomizedProduct",
  async () => {
    try {
      const { data } = await axiosInstance.get("/api/dotcustomizedRoute");
      return data.data;
    } catch (error) {
      toastError(error.response.data.message);
    }
  }
);

export const fetchdotCustomizedProductDetails = createAsyncThunk(
  "dotCustomizedproducts/fetchdotCustomizedProductDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/dotcustomizedRoute/${id}`);
      return data.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);

export const createdotCustomizedProduct = createAsyncThunk(
  "dotCustomizedproducts/createdotCustomizedProduct",

  async (dotproductdata) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/dotcustomizedRoute",
        dotproductdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );
      // const response = await axios.post("http://localhost:7000/api/dotcustomizedRoute", dotproductdata);
      return data;
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  }
);

export const updatedotCustomizedProduct = createAsyncThunk(
  "dotCustomizedproducts/updatedotCustomizedProduct",
  async ({ id, dotproductdata }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/dotcustomizedRoute/${id}`,
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
      toastError(error.response.data.message);
      //   console.log(error.response.data.message);
    }
  }
);

export const dotCustomizedproduct = createAsyncThunk(
  "dotCustomizedproducts/dotCustomizedproduct",
  async (dotProductId) => {
    await axiosInstance.delete(`/api/dotcustomizedRoute/${dotProductId}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    return dotProductId;
  }
);

const dotCustomizedproductslice = createSlice({
  name: "dotCustomizedproducts",
  initialState: {
    dotCustomizedproducts: [],
    loading: "idle",
    error: null,
    success: false,
    message: "",
    dotProductdetails: {},
    dotProductBundleData: [],
  },

  reducers: {
    updateProductonPosition: (state, action) => {
      const newdata = replaceObjectbyID(
        state.dotProductdetails,
        action.payload.productID,
        action.payload.newproduct
      );

      state.dotProductdetails = newdata;
    },
  },
  extraReducers: (builder) => {
    builder
      //Get dotCustomizedproducts
      .addCase(fetchdotCustomizedProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchdotCustomizedProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
        state.dotCustomizedproducts = action.payload;
      })
      .addCase(fetchdotCustomizedProduct.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get dotCustomizedproducts Details

      .addCase(fetchdotCustomizedProductDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchdotCustomizedProductDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.dotProductdetails = action.payload;
        // state.dotProductBundle = true
      })
      .addCase(fetchdotCustomizedProductDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create dotProduct

      .addCase(createdotCustomizedProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createdotCustomizedProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.dotCustomizedproducts.push(action.payload.data);
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(createdotCustomizedProduct.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update dotProduct

      .addCase(updatedotCustomizedProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updatedotCustomizedProduct.fulfilled, (state, action) => {
        const index = state.dotCustomizedproducts.findIndex(
          (dotProduct) => dotProduct._id === action.payload._id
        );
        if (index !== -1) {
          state.dotCustomizedproducts[index] = action.payload;
        }
      })
      .addCase(updatedotCustomizedProduct.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete dotProduct

      .addCase(dotCustomizedproduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(dotCustomizedproduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.dotCustomizedproducts = state.dotCustomizedproducts.filter(
          (dotProduct) => dotProduct._id !== action.payload
        );
      })

      .addCase(dotCustomizedproduct.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

function replaceObjectbyID(dotProduct, previousproductId, newobject) {
  const newProductArray = dotProduct.dots.map((item) => {
    if (item.productId._id === previousproductId) {
      return { ...item, productId: newobject };
    } else {
      return item;
    }
  });

  return { ...dotProduct, dots: newProductArray };
}

export const { updateProductonPosition } = dotCustomizedproductslice.actions;

export default dotCustomizedproductslice.reducer;
