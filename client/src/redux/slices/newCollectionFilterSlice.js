import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";

export const fetchCollectionFilters = createAsyncThunk(
  "CollectionFilters/fetchCollectionFilters",
  async () => {
    try {
      const { data } = await axiosInstance.get("/api/collection-filter");
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchCollectionFiltersDetails = createAsyncThunk(
  "CollectionFilters/fetchCollectionFiltersDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/collection-filter/${id}`);
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

// create collection filter name and tag
export const createCollectionFilter = createAsyncThunk(
  "CollectionFilters/createCollectionFilter",
  async (CollectionFilterdata) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/collection-filter",
        CollectionFilterdata,
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
      toastError(error?.response?.data.message);
    }
  }
);

// create collection filter name and tag
export const createCollectionFilterTag = createAsyncThunk(
  "CollectionFilters/createCollectionFilterTag",
  async (tag) => {
    try {
      const { data } = await axiosInstance.post("/api/collection-tag", tag, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data?.success) {
        toastSuceess(data?.message);
      }

      return data.data;
    } catch (error) {
      toastError(error?.response?.data.message);
    }
  }
);

export const updateCollectionFilter = createAsyncThunk(
  "CollectionFilters/updateCollectionFilter",
  async ({ id, CollectionFilterdata }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/collection-filter/${id}`,
        CollectionFilterdata,
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
      toastError(error?.response?.data.message);
    }
  }
);

export const updateCollectionFilterTag = createAsyncThunk(
  "CollectionFilters/updateCollectionFilterTag",
  async ({ id, updatedData }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/collection-tag/${id}`,
        updatedData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        toastSuceess(data?.message);
      }

      return data?.data;
    } catch (error) {
      toastError(error?.response?.data.message);
    }
  }
);

export const deleteCollectionFilter = createAsyncThunk(
  "CollectionFilters/deleteCollectionFilter",
  async (CollectionFilterId) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/collection-filter/${CollectionFilterId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        toastSuceess(data?.message);
      }

      return CollectionFilterId;
    } catch (error) {
      toastError(error?.response?.data.message);
    }
  }
);

export const deleteCollectionFilterTag = createAsyncThunk(
  "CollectionFilters/deleteCollectionFilterTag",
  async (CollectionFilterTagId) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/collection-tag/${CollectionFilterTagId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        toastSuceess(data?.message);
      }

      return CollectionFilterTagId;
    } catch (error) {
      toastError(error?.response?.data.message);
    }
  }
);

/** filter data from single / customize dot product */
export const searchCollectionFilter = createAsyncThunk(
  "CollectionFilters/searchCollectionFilter",
  async ({ Tags }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/CollectionFilter/filter/tags?filter=${JSON.stringify(Tags)}`
      );
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

const NewCollectionFilterSlice = createSlice({
  name: "CollectionFilters",
  initialState: {
    CollectionFilters: [],
    loading: "idle",
    error: null,
    message: "",
    CollectionFilterdetails: {},
    filterProductsByCollectionFilter: [],
    CollectionFilterId: null,
    tagId: null,
    tag: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get CollectionFilters
      .addCase(fetchCollectionFilters.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCollectionFilters.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.CollectionFilters = action.payload;
      })
      .addCase(fetchCollectionFilters.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get CollectionFilters Details
      .addCase(fetchCollectionFiltersDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCollectionFiltersDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.CollectionFilterdetails = action.payload;
      })
      .addCase(fetchCollectionFiltersDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create CollectionFilter
      .addCase(createCollectionFilter.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createCollectionFilter.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(createCollectionFilter.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create Collection Filter Tag
      .addCase(createCollectionFilterTag.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createCollectionFilterTag.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.tag = action.payload;
      })
      .addCase(createCollectionFilterTag.rejected, (state) => {
        state.loading = "rejected";
      })

      //Update CollectionFilter
      .addCase(updateCollectionFilter.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateCollectionFilter.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(updateCollectionFilter.rejected, (state) => {
        state.loading = "rejected";
      })

      //Update updateCollectionFilterTag
      .addCase(updateCollectionFilterTag.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateCollectionFilterTag.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.tagId = action.payload;
      })
      .addCase(updateCollectionFilterTag.rejected, (state) => {
        state.loading = "rejected";
      })

      /**search filter data from single & customize dot product */
      .addCase(searchCollectionFilter.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.filterProductsByCollectionFilter = action.payload;
      })
      .addCase(searchCollectionFilter.rejected, (state) => {
        state.loading = "rejected";
      })
      .addCase(searchCollectionFilter.pending, (state) => {
        state.loading = "pending";
      })

      //Delete CollectionFilter

      .addCase(deleteCollectionFilter.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteCollectionFilter.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.CollectionFilterId = action.payload;
      })
      .addCase(deleteCollectionFilter.rejected, (state) => {
        state.loading = "rejected";
      })

      .addCase(deleteCollectionFilterTag.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteCollectionFilterTag.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.tagId = action.payload;
      })
      .addCase(deleteCollectionFilterTag.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default NewCollectionFilterSlice.reducer;
