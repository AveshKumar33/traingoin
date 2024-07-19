import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";

export const fetchTags = createAsyncThunk("tags/fetchTags", async () => {
  const { data } = await axiosInstance.get("/api/tags");
  return data.data;
});

export const fetchTagsDetails = createAsyncThunk(
  "tags/fetchTagsDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/tags/${id}`);
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const createTag = createAsyncThunk("tags/createTag", async (tagdata) => {
  try {
    const { data } = await axiosInstance.post("/api/tags", tagdata, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });

    if (data?.success) {
      toastSuceess(data?.message);
    }

    return data;
  } catch (error) {
    toastError(error.response?.data);
  }
});

export const updateTag = createAsyncThunk(
  "tags/updateTag",
  async ({ id, tagdata }) => {
    try {
      const { data } = await axiosInstance.put(`/api/tags/${id}`, tagdata, {
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

export const deleteTag = createAsyncThunk("tags/deleteTag", async (tagId) => {
  try {
    const { data } = await axiosInstance.delete(`/api/tags/${tagId}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });

    if (data?.success) {
      toastSuceess(data?.message);
    }

    return tagId;
  } catch (error) {
    toastError(error?.response?.data?.message);
  }
});

const tagslice = createSlice({
  name: "tags",
  initialState: {
    tags: [],
    loading: "idle",
    error: null,
    message: "",
    tagdetails: {},
    tagId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get tags
      .addCase(fetchTags.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = "rejected";
      })

      //Get tags Details

      .addCase(fetchTagsDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchTagsDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.tagdetails = action.payload;
      })
      .addCase(fetchTagsDetails.rejected, (state, action) => {
        state.loading = "rejected";
      })

      //Create tag

      .addCase(createTag.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(createTag.rejected, (state, action) => {
        state.loading = "rejected";
      })

      //Update tag

      .addCase(updateTag.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(updateTag.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete tag

      .addCase(deleteTag.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.tagId = action.payload;
      })
      .addCase(deleteTag.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default tagslice.reducer;
