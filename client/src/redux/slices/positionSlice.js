import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";

// const config = {
//   headers: {
//     "Content-Type": "application/json",
//     token: localStorage.getItem("token"),
//   },
// };

export const fetchPositions = createAsyncThunk(
  "position/fetchPositions",
  async () => {
    try {
      const { data } = await axiosInstance.get("/api/position");
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchPositionByAttributeId = createAsyncThunk(
  "parameters/fetchPositionByAttributeId",
  async ({ id, currentPage = 0, rowsPerPage = 20 }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/position/attribute-id/${id}?page=${
          currentPage + 1
        }&limit=${rowsPerPage}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        }
      );
      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchPositionDetails = createAsyncThunk(
  "position/fetchPositionDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/position/${id}`);
      return data.data;
    } catch (error) {
      toastError(error.response.data.message);
    }
  }
);

export const createPosition = createAsyncThunk(
  "position/createPosition",
  async (positionData) => {
    try {
      const { data } = await axiosInstance.post("/api/position", positionData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const updatePosition = createAsyncThunk(
  "position/updatePosition",
  async ({ id, tagdata }) => {
    try {
      const { data } = await axiosInstance.put(`/api/position/${id}`, tagdata, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data?.success) {
        toastSuceess(data?.message);
      }

      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const deletePosition = createAsyncThunk(
  "position/deletePosition",
  async (positionId) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/position/${positionId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        toastSuceess(data?.message);
      }

      return positionId;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

const positionSlice = createSlice({
  name: "position",
  initialState: {
    positions: [],
    loading: "idle",
    error: null,
    message: "",
    positionDetails: {},
    totalData: 0,
    positionId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get position
      .addCase(fetchPositions.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchPositions.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.positions = action.payload;
      })
      .addCase(fetchPositions.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get position
      .addCase(fetchPositionByAttributeId.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchPositionByAttributeId.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.positions = action.payload.data;
        state.totalData = action.payload.totalCount;
      })
      .addCase(fetchPositionByAttributeId.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get position Details

      .addCase(fetchPositionDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchPositionDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.positionDetails = action.payload;
      })
      .addCase(fetchPositionDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create tag

      .addCase(createPosition.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createPosition.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        // state.positions.push(action.payload.data);
      })
      .addCase(createPosition.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update position

      .addCase(updatePosition.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updatePosition.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(updatePosition.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete position

      .addCase(deletePosition.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deletePosition.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.positionId = action.payload;
      })
      .addCase(deletePosition.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default positionSlice.reducer;
