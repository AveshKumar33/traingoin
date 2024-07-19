import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";

export const fetchprojectCategory = createAsyncThunk(
  "projectCategory/fetchprojectCategory",
  async () => {
    const { data } = await axiosInstance.get("/api/projectCategory");
    return data.data;
  }
);

export const fetchprojectCategoryDetails = createAsyncThunk(
  "projectCategory/fetchprojectCategoryDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/projectCategory/${id}`);
      return data.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);

export const createprojectCategory = createAsyncThunk(
  "projectCategory/createprojectCategory",
  async (projectCategorydata) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/projectCategory",
        projectCategorydata,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      // const response = await axios.post("http://localhost:7000/api/projectCategory", projectCategorydata);
      return data.data;
    } catch (error) {
      console.log("error", error.response.data);

      alert(error.response.data.message);
    }
  }
);

export const updateprojectCategory = createAsyncThunk(
  "projectCategory/updateprojectCategory",
  async ({ id, projectCategorydata }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/projectCategory/${id}`,
        projectCategorydata
      );
      return data.data;
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const deleteprojectCategory = createAsyncThunk(
  "projectCategory/deleteprojectCategory",
  async (projectCategoryId) => {
    await axiosInstance.delete(`/api/projectCategory/${projectCategoryId}`);
    return projectCategoryId;
  }
);

const projectCategorylice = createSlice({
  name: "projectCategory",
  initialState: {
    projectCategory: [],
    loading: "idle",
    error: null,
    message: "",
    projectCategorydetails: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get projectCategory
      .addCase(fetchprojectCategory.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchprojectCategory.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.projectCategory = action.payload;
      })
      .addCase(fetchprojectCategory.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get projectCategory Details

      .addCase(fetchprojectCategoryDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchprojectCategoryDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.projectCategorydetails = action.payload;
      })
      .addCase(fetchprojectCategoryDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create projectCategory

      .addCase(createprojectCategory.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createprojectCategory.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.projectCategory.push(action?.payload?.data);
      })
      .addCase(createprojectCategory.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update projectCategory

      .addCase(updateprojectCategory.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateprojectCategory.fulfilled, (state, action) => {
        const index = state.projectCategory.findIndex(
          (projectCategory) => projectCategory._id === action.payload._id
        );
        if (index !== -1) {
          state.projectCategory[index] = action.payload;
        }
      })
      .addCase(updateprojectCategory.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete projectCategory

      .addCase(deleteprojectCategory.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteprojectCategory.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.projectCategory = state.projectCategory.filter(
          (projectCategory) => projectCategory._id !== action.payload
        );
      })
      .addCase(deleteprojectCategory.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default projectCategorylice.reducer;
