import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";

export const fetchExibhitions = createAsyncThunk(
  "exibhitions/fetchExibhitions",
  async () => {
    const { data } = await axiosInstance.get("/api/exibhitions");
    return data.data;
  }
);

export const fetchExibhitionsDetails = createAsyncThunk(
  "exibhitions/fetchExibhitionsDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/exibhitions/${id}`);

      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
      console.log(error.response.data.message);
    }
  }
);

export const createExibhitions = createAsyncThunk(
  "exibhitions/createExibhitions",
  async (exibhitionsData) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/exibhitions",
        exibhitionsData,
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

export const updateExibhitions = createAsyncThunk(
  "exibhitions/updateExibhitions",
  async (updateddata) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/exibhitions/${updateddata.id}`,
        updateddata.exibhitionsData,
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

export const deleteExibhitions = createAsyncThunk(
  "exibhitions/deleteExibhitions",
  async (exibhitionsId) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/exibhitions/${exibhitionsId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data?.success) {
        toastSuceess(data?.message);
      }

      return exibhitionsId;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

const exibhitionsSlice = createSlice({
  name: "exibhitions",
  initialState: {
    exibhitions: [],
    loading: "idle",
    error: null,
    message: "",
    exibhitionsdetails: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get Experience
      .addCase(fetchExibhitions.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchExibhitions.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.exibhitions = action.payload;
      })
      .addCase(fetchExibhitions.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get Experience Details

      .addCase(fetchExibhitionsDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchExibhitionsDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.exibhitionsdetails = action.payload;
      })
      .addCase(fetchExibhitionsDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create Experience

      .addCase(createExibhitions.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createExibhitions.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.exibhitions.push(action?.payload?.data);
      })
      .addCase(createExibhitions.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update experience

      .addCase(updateExibhitions.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateExibhitions.fulfilled, (state, action) => {
        const index = state.exibhitions.findIndex(
          (exibhitions) => exibhitions._id === action?.payload?._id
        );
        if (index !== -1) {
          state.exibhitions[index] = action.payload;
        }
      })
      .addCase(updateExibhitions.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete experience
      .addCase(deleteExibhitions.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteExibhitions.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.exibhitions = state.exibhitions.filter(
          (exibhitions) => exibhitions?._id !== action.payload
        );
      })
      .addCase(deleteExibhitions.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default exibhitionsSlice.reducer;
