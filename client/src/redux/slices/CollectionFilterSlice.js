import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError } from "../../utils/reactToastify";

export const fetchCollectionFilters = createAsyncThunk(
  "CollectionFilters/fetchCollectionFilters",
  async () => {
    const { data } = await axiosInstance.get("/api/CollectionFilters");
    return data.data;
  }
);

export const fetchCollectionFiltersDetails = createAsyncThunk(
  "CollectionFilters/fetchCollectionFiltersDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/CollectionFilters/${id}`);
      return data.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);

export const createCollectionFilter = createAsyncThunk(
  "CollectionFilters/createCollectionFilter",
  async (CollectionFilterdata) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/CollectionFilters",
        CollectionFilterdata,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      return data.data;
    } catch (error) {
      console.log("error", error.response.data);

      alert(error.response.data.message);
    }
  }
);

export const updateCollectionFilter = createAsyncThunk(
  "CollectionFilters/updateCollectionFilter",
  async ({ id, CollectionFilterdata }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/CollectionFilters/${id}`,
        CollectionFilterdata,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      return data.data;
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const deleteCollectionFilter = createAsyncThunk(
  "CollectionFilters/deleteCollectionFilter",
  async (CollectionFilterId) => {
    await axiosInstance.delete(`/api/CollectionFilters/${CollectionFilterId}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    return CollectionFilterId;
  }
);

/** filter data from single / customize dot product */
export const searchCollectionFilter = createAsyncThunk(
  "CollectionFilters/searchCollectionFilter",
  async ({ Tags, limit, page }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/CollectionFilter/filter/tags?filter=${JSON.stringify(
          Tags
        )}&limit=${limit}&page=${page}`
      );
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

const CollectionFilterslice = createSlice({
  name: "CollectionFilters",
  initialState: {
    CollectionFilters: [],
    loading: "idle",
    error: null,
    message: "",
    CollectionFilterdetails: {},
    filterProductsByCollectionFilter: [],
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
        state.CollectionFilters = state.CollectionFilters.filter(
          (CollectionFilter) => CollectionFilter._id !== action.payload
        );
      })
      .addCase(deleteCollectionFilter.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default CollectionFilterslice.reducer;
