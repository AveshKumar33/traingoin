import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";

export const fetchAboutUs = createAsyncThunk(
  "aboutUs/fetchAboutUs",
  async () => {
    const { data } = await axiosInstance.get("/api/about-us");
    return data.data;
  }
);

export const fetchAboutUsDetails = createAsyncThunk(
  "aboutUs/fetchAboutUsDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/about-us/${id}`);

      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
      console.log(error.response.data.message);
    }
  }
);

export const createAboutUs = createAsyncThunk(
  "aboutUs/createAboutUs",
  async (aboutUsData) => {
    try {
      const { data } = await axiosInstance.post("/api/about-us", aboutUsData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      if (data?.success) {
        toastSuceess(data?.message);
      }
      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const updateAboutUs = createAsyncThunk(
  "aboutUs/updateAboutUs",
  async (updateddata) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/about-us/${updateddata.id}`,
        updateddata.aboutUsData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data?.success) {
        toastSuceess(data?.message);
      }

      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const deleteAboutUs = createAsyncThunk(
  "aboutUs/deleteAboutUs",
  async (aboutUsId) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/about-us/${aboutUsId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data?.success) {
        toastSuceess(data?.message);
      }

      return aboutUsId;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

const aboutUsSlice = createSlice({
  name: "aboutUs",
  initialState: {
    aboutUs: [],
    loading: "idle",
    error: null,
    message: "",
    aboutUsdetails: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get Experience
      .addCase(fetchAboutUs.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchAboutUs.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.aboutUs = action.payload;
      })
      .addCase(fetchAboutUs.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get Experience Details

      .addCase(fetchAboutUsDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchAboutUsDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.aboutUsdetails = action.payload;
      })
      .addCase(fetchAboutUsDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create Experience

      .addCase(createAboutUs.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createAboutUs.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.aboutUs.push(action?.payload?.data);
      })
      .addCase(createAboutUs.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update experience

      .addCase(updateAboutUs.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateAboutUs.fulfilled, (state, action) => {
        const index = state.aboutUs.findIndex(
          (aboutUs) => aboutUs._id === action?.payload?._id
        );
        if (index !== -1) {
          state.aboutUs[index] = action.payload;
        }
      })
      .addCase(updateAboutUs.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete experience
      .addCase(deleteAboutUs.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteAboutUs.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.aboutUs = state.aboutUs.filter(
          (aboutUs) => aboutUs?._id !== action.payload
        );
      })
      .addCase(deleteAboutUs.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default aboutUsSlice.reducer;
