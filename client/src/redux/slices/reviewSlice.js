import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";

// const config = {
//   headers: {
//     "Content-Type": "application/json",
//   },
// };

const formdataconfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export const fetchReview = createAsyncThunk("reviews/fetchReview", async () => {
  try {
    const { data } = await axiosInstance.get("/api/review");
    return data.data;
  } catch (err) {
    console.log(err);
  }
});
export const fetchTopFiveReviews = createAsyncThunk(
  "reviews/fetchTopFiveReviews/",
  async () => {
    try {
      const { data } = await axiosInstance.get("/api/review/top-five/reviews");
      return data.data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const fetchReviewDetails = createAsyncThunk(
  "reviews/fetchReviewDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/review/${id}`);
      return data.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);

export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (reviewdata) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/review",
        reviewdata,
        formdataconfig
      );

      return data;
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  }
);

export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ id, reviewdata }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/review/${id}`,
        reviewdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId) => {
    await axiosInstance.delete(`/api/review/${reviewId}`);
    return reviewId;
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    topFiveReviews: [],
    loading: "idle",
    error: null,
    success: false,
    message: "",
    reviewdetails: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get reviews
      .addCase(fetchReview.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchReview.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.reviews = action.payload;
      })
      .addCase(fetchReview.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })
      //Get fetchTopFiveReviews
      .addCase(fetchTopFiveReviews.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchTopFiveReviews.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.topFiveReviews = action.payload;
      })
      .addCase(fetchTopFiveReviews.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get reviews Details

      .addCase(fetchReviewDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchReviewDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.reviewdetails = action.payload;
      })
      .addCase(fetchReviewDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create review

      .addCase(createReview.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.reviews.push(action?.payload?.data);
        state.success = true;
        state.message = action?.payload?.message;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update review

      .addCase(updateReview.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(
          (review) => review._id === action?.payload?._id
        );
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete review
      .addCase(deleteReview.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.reviews = state.reviews.filter(
          (review) => review._id !== action.payload
        );
      })
      .addCase(deleteReview.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default reviewSlice.reducer;
