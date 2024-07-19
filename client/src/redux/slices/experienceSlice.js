import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";

export const fetchExperience = createAsyncThunk(
  "experience/fetchExperience",
  async () => {
    const { data } = await axiosInstance.get("/api/experience");
    return data.data;
  }
);

export const fetchExperienceDetails = createAsyncThunk(
  "experience/fetchExperienceDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/experience/${id}`);

      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
      console.log(error.response.data.message);
    }
  }
);

export const createExperience = createAsyncThunk(
  "experience/createExperience",
  async (experienceData) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/experience",
        experienceData,
        {
          headers: {
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

export const updateExperience = createAsyncThunk(
  "experience/updateExperience",
  async (updateddata) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/experience/${updateddata.id}`,
        updateddata.experienceData,
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

export const deleteExperience = createAsyncThunk(
  "experience/deleteExperience",
  async (experienceId) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/experience/${experienceId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data?.success) {
        toastSuceess(data?.message);
      }

      return experienceId;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

const ExperienceSlice = createSlice({
  name: "Experience",
  initialState: {
    Experience: [],
    loading: "idle",
    error: null,
    message: "",
    Experiencedetails: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get Experience
      .addCase(fetchExperience.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchExperience.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.Experience = action.payload;
      })
      .addCase(fetchExperience.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get Experience Details

      .addCase(fetchExperienceDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchExperienceDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.Experiencedetails = action.payload;
      })
      .addCase(fetchExperienceDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create Experience

      .addCase(createExperience.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createExperience.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.Experience.push(action?.payload?.data);
      })
      .addCase(createExperience.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update experience

      .addCase(updateExperience.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        const index = state.Experience.findIndex(
          (Experience) => Experience._id === action?.payload?._id
        );
        if (index !== -1) {
          state.Experience[index] = action.payload;
        }
      })
      .addCase(updateExperience.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete experience
      .addCase(deleteExperience.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.Experience = state.Experience.filter(
          (experience) => experience?._id !== action.payload
        );
      })
      .addCase(deleteExperience.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default ExperienceSlice.reducer;
