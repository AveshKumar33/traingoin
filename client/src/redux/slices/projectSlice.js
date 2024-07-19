import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";

export const fetchproject = createAsyncThunk(
  "project/fetchproject",
  async () => {
    const { data } = await axiosInstance.get("/api/project");
    return data.data;
  }
);

export const fetchprojectDetails = createAsyncThunk(
  "project/fetchprojectDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/project/${id}`);
      return data.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);

export const createproject = createAsyncThunk(
  "project/createproject",
  async (projectdata) => {
    try {
      const { data } = await axiosInstance.post("/api/project", projectdata, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      // const response = await axios.post("http://localhost:7000/api/project", projectdata);
      return data.data;
    } catch (error) {
      console.log("error", error.response.data);

      alert(error.response.data.message);
    }
  }
);

export const updateproject = createAsyncThunk(
  "project/updateproject",
  async ({ id, projectdata }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/project/${id}`,
        projectdata
      );
      return data.data;
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const deleteproject = createAsyncThunk(
  "project/deleteproject",
  async (projectId) => {
    await axiosInstance.delete(`/api/project/${projectId}`);
    return projectId;
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState: {
    project: [],
    loading: "idle",
    error: null,
    message: "",
    projectdetails: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get project
      .addCase(fetchproject.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchproject.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.project = action.payload;
      })
      .addCase(fetchproject.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get project Details

      .addCase(fetchprojectDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchprojectDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.projectdetails = action.payload;
      })
      .addCase(fetchprojectDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create project

      .addCase(createproject.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createproject.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.project.push(action.payload.data);
      })
      .addCase(createproject.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update project

      .addCase(updateproject.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateproject.fulfilled, (state, action) => {
        const index = state.project.findIndex(
          (project) => project?._id === action?.payload?._id
        );
        if (index !== -1) {
          state.project[index] = action.payload;
        }
      })
      .addCase(updateproject.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete project

      .addCase(deleteproject.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteproject.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.project = state.project.filter(
          (project) => project._id !== action.payload
        );
      })
      .addCase(deleteproject.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default projectSlice.reducer;
