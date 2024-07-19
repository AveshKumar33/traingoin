import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";

export const fetchUOM = createAsyncThunk("uom/fetchUOM", async () => {
  const { data } = await axiosInstance.get("/api/uom");
  return data.data;
});

export const fetchUOMDetails = createAsyncThunk(
  "uom/fetchUOMDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/uom/${id}`);
      return data.data;
    } catch (error) {
      toastError(error.response.data.message);
    }
  }
);

export const createUOM = createAsyncThunk("uom/createUOM", async (uomData) => {
  try {
    const { data } = await axiosInstance.post("/api/uom", uomData, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });

    if (data?.success) {
      toastSuceess(data.message);
    }

    return data;
  } catch (error) {
    toastError(error.response.data.message);
  }
});

export const updateUOM = createAsyncThunk(
  "uom/updateUOM",
  async ({ id, tagdata }) => {
    try {
      const { data } = await axiosInstance.put(`/api/uom/${id}`, tagdata, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data?.success) {
        toastSuceess(data?.message);
      }

      return data;
    } catch (error) {
      toastError(error.response.data.message);
    }
  }
);

export const deleteUOM = createAsyncThunk("uom/deleteUOM", async (uomId) => {
  const { data } = await axiosInstance.delete(`/api/uom/${uomId}`, {
    headers: {
      token: localStorage.getItem("token"),
    },
  });

  if (data?.success) {
    toastSuceess(data?.message);
  }

  return uomId;
});

const uomSlice = createSlice({
  name: "uom",
  initialState: {
    uoms: [],
    loading: "idle",
    error: null,
    message: "",
    uomDetails: {},
    uomId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get uom
      .addCase(fetchUOM.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchUOM.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.uoms = action.payload;
      })
      .addCase(fetchUOM.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get uom Details
      .addCase(fetchUOMDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchUOMDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.uomDetails = action.payload;
      })
      .addCase(fetchUOMDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create tag

      .addCase(createUOM.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createUOM.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(createUOM.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update tag

      .addCase(updateUOM.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateUOM.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(updateUOM.rejected, (state, action) => {
        state.loading = "rejected";
      })

      //Delete tag

      .addCase(deleteUOM.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteUOM.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.uomId = action.payload;
      })
      .addCase(deleteUOM.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      });
  },
});

export default uomSlice.reducer;
