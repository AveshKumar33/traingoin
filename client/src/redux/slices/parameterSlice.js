import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";

// const config = {
//   headers: {
//     "Content-Type": "application/json",
//     token: localStorage.getItem("token"),
//   },
// };

export const fetchParameters = createAsyncThunk(
  "parameters/fetchParameters",
  async () => {
    try {
      const { data } = await axiosInstance.get(
        "/api/parameter",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        }
      );
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchParametersByAttributeId = createAsyncThunk(
  "parameters/fetchParametersByAttributeId",
  async ({ id, searchData, currentPage, rowsPerPage }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/parameter/attribute-id/${id}?search=${searchData}&page=${
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
      return await data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchAllParametersByAttributeId = createAsyncThunk(
  "parameters/fetchAllParametersByAttributeId",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/parameter/attribute-id/all/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        }
      );
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const getAllSingleProductParameterByAttributeId = createAsyncThunk(
  "parameters/getAllSingleProductParameterByAttributeId",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/parameter/attribute-id/single-product/all/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        }
      );
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchParametersDetails = createAsyncThunk(
  "parameters/fetchParametersDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/parameter/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        }
      );
      return data.data;
    } catch (error) {
      toastError(error.response.data.message);
    }
  }
);

export const fetchParametersPositionImageDetailsBy = createAsyncThunk(
  "parameters/fetchParametersPositionImageDetailsBy",
  async ({ parameterId, positionId, attributeId }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/combination/${parameterId}/${positionId}/${attributeId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        }
      );
      return data.data;
    } catch (error) {
      toastError(error.response.data.message);
    }
  }
);

export const createParameter = createAsyncThunk(
  "parameters/createParameter",
  async (parameterData) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/parameter",
        parameterData,
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
      toastError(error.response.data.message);

      // alert(error.response.data.message);
      // console.log(error);
    }
  }
);

export const updateParameter = createAsyncThunk(
  "parameters/updateParameter",
  async ({ id, parameterData }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/parameter/${id}`,
        parameterData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        toastSuceess(data?.message);
      }
      return data.data;
    } catch (error) {
      toastError(error.response.data.message);
    }
  }
);

export const deleteParameter = createAsyncThunk(
  "parameters/deleteParameter",
  async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/api/parameter/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data?.success) {
        toastSuceess(data?.message);
      }

      return id;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

const parameterSlice = createSlice({
  name: "parameters",
  initialState: {
    parameters: [],
    singleProdParameters: [],
    totalData: 0,
    loading: "idle",
    error: null,
    success: false,
    message: "",
    parametersDetails: {},
    parameterPositionImage: [],
    parameterId: null,
    // userToken,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get parameters
      .addCase(fetchParameters.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchParameters.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.parameters = action.payload;
      })
      .addCase(fetchParameters.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get parameters by attribute id
      .addCase(fetchParametersByAttributeId.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchParametersByAttributeId.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.parameters = action.payload.data;
        state.totalData = action.payload.totalCount;
      })
      .addCase(fetchParametersByAttributeId.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get combination by parameter, postion & attribute id
      .addCase(fetchParametersPositionImageDetailsBy.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetchParametersPositionImageDetailsBy.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          state.parameterPositionImage = action.payload;
        }
      )
      .addCase(
        fetchParametersPositionImageDetailsBy.rejected,
        (state, action) => {
          state.loading = "rejected";
          state.error = action.error.message;
        }
      )

      //Get all parameters by attribute id
      .addCase(fetchAllParametersByAttributeId.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchAllParametersByAttributeId.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.parameters = action.payload;
      })
      .addCase(fetchAllParametersByAttributeId.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get all parameters by attribute id
      .addCase(getAllSingleProductParameterByAttributeId.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        getAllSingleProductParameterByAttributeId.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          state.singleProdParameters = action.payload;
        }
      )
      .addCase(
        getAllSingleProductParameterByAttributeId.rejected,
        (state, action) => {
          state.loading = "rejected";
          state.error = action.error.message;
        }
      )

      //Get parameters Details

      .addCase(fetchParametersDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchParametersDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.parametersDetails = action.payload;
      })
      .addCase(fetchParametersDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create user

      .addCase(createParameter.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createParameter.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(createParameter.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update user

      .addCase(updateParameter.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateParameter.fulfilled, (state) => {
        state.loading = "fulfilled";
      })
      .addCase(updateParameter.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete user
      .addCase(deleteParameter.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteParameter.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.parameterId = action.payload;
      })
      .addCase(deleteParameter.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default parameterSlice.reducer;
