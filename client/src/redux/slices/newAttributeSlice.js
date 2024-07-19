import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";

// const config = {
//   headers: {
//     token: localStorage.getItem("token"),
//   },
// };

// const formdataconfig = {
//   headers: {
//     "Content-Type": "multipart/form-data",
//   },
// };

export const fetchattribute = createAsyncThunk(
  "attributes/fetchattribute",
  async ({ searchData, currentPage = 0, rowsPerPage = 10 }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/attribute-new?search=${JSON.stringify(searchData)}&page=${
          currentPage + 1
        }&limit=${rowsPerPage}`
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchAllisCustomizedAttribute = createAsyncThunk(
  "attributes/fetchAllisCustomizedAttribute",
  async (filterData) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/parameter/filter?filter=${filterData}`
      );

      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchAllAttribute = createAsyncThunk(
  "attributes/fetchAllAttribute",
  async () => {
    try {
      const { data } = await axiosInstance.get(`/api/attribute-new`);

      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchattributeDetails = createAsyncThunk(
  "attributes/fetchattributeDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/attribute-new/${id}`);
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const createAttribute = createAsyncThunk(
  "attributes/createAttribute",
  async (attributedata) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/attribute-new",
        attributedata,
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

export const updateAttribute = createAsyncThunk(
  "attributes/updateAttribute",
  async ({ id, attributedata }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/attribute-new/${id}`,
        attributedata,
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

export const deleteAttribute = createAsyncThunk(
  "attributes/deleteAttribute",
  async (attributeId) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/attribute-new/${attributeId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        toastSuceess(data?.message);
      }

      return attributeId;
    } catch (error) {
      toastError(error.response.data.message);
    }
  }
);

const uewAttributeslice = createSlice({
  name: "attributes",
  initialState: {
    attributes: [],
    totalData: 0,
    loading: "idle",
    error: null,
    success: false,
    message: "",
    attributedetails: null,
    attributeId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get attributes
      .addCase(fetchattribute.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchattribute.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.attributes = action.payload.data;
        state.totalData = action.payload.totalCount;
      })
      .addCase(fetchattribute.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      .addCase(fetchAllisCustomizedAttribute.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchAllisCustomizedAttribute.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.attributes = action.payload;
      })
      .addCase(fetchAllisCustomizedAttribute.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get All attributes
      .addCase(fetchAllAttribute.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchAllAttribute.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.attributes = action.payload;
      })
      .addCase(fetchAllAttribute.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get attributes Details

      .addCase(fetchattributeDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchattributeDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.attributedetails = action.payload;
      })
      .addCase(fetchattributeDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create attribute

      .addCase(createAttribute.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createAttribute.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
      })
      .addCase(createAttribute.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update attribute

      .addCase(updateAttribute.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateAttribute.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(updateAttribute.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete attribute
      .addCase(deleteAttribute.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteAttribute.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.attributeId = action.payload;
      })

      .addCase(deleteAttribute.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default uewAttributeslice.reducer;
