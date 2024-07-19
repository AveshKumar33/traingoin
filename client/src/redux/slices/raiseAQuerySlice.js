import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";

export const fetchRaiseAQuery = createAsyncThunk(
  "raiseAQuery/fetchRaiseAQuery",
  async ({ searchData = "", currentPage = 0, rowsPerPage = 0 }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/raiseAQuery?search=${searchData}&page=${
          currentPage + 1
        }&limit=${rowsPerPage}`
      );
      return data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);

export const fetchRaiseAQueryDetails = createAsyncThunk(
  "raiseAQuery/fetchRaiseAQueryDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/raiseAQuery/${id}`);
      return data.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);

export const createRaiseAQuery = createAsyncThunk(
  "raiseAQuery/createRaiseAQuery",
  async (raiseAQueryData) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/raiseAQuery",
        raiseAQueryData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      return data;
    } catch (error) {
      console.log("error", error.response.data);

      alert(error.response.data.message);
    }
  }
);

export const updateRaiseAQuery = createAsyncThunk(
  "raiseAQuery/updateRaiseAQuery",
  async ({ id, queryData }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/raiseAQuery/${id}`,
        queryData
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
export const architectCountById = createAsyncThunk(
  "raiseAQuery/architectCountById",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/raiseAQuery/count/${id}`);
      return data?.data;
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const deleteRaiseAQuery = createAsyncThunk(
  "raiseAQuery/deleteRaiseAQuery",
  async (id) => {
    try {
      await axiosInstance.delete(`/api/raiseAQuery/${id}`);
      return id;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);
export const getAllRequestForPriceProduct = createAsyncThunk(
  "raiseAQuery/getAllRequestForPriceProduct",
  async (userDetail) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/raiseAQuery/product?MobNumber=${userDetail.MobNumber}&&Email=${userDetail.Email}`
      );
      return data?.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);
export const getRequestForPriceProductCombinations = createAsyncThunk(
  "raiseAQuery/getRequestForPriceProductCombinations",
  async (rfpId) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/raiseAQuery/combination/${rfpId}`
      );
      return data?.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);

const raiseAQuerySlice = createSlice({
  name: "raiseAQuery",
  initialState: {
    raiseAQuery: [],
    totalCount: 0,
    allRequestForPriceProduct: [],
    requestForPriceProductCombinations: {},
    loading: "idle",
    error: null,
    message: "",
    reqForPriseCount: {},
    raiseAQueryDetails: {},
    updatedId: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get RaiseAQuery
      .addCase(fetchRaiseAQuery.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchRaiseAQuery.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.raiseAQuery = action.payload?.data;
        state.totalCount = action.payload?.totalCount;
      })
      .addCase(fetchRaiseAQuery.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })
      //Get RaiseAQuery getAllRequestForPriceProduct

      .addCase(getAllRequestForPriceProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getAllRequestForPriceProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.allRequestForPriceProduct = action.payload;
      })
      .addCase(getAllRequestForPriceProduct.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })
      //Get RaiseAQuery getRequestForPriceProductCombinations

      .addCase(getRequestForPriceProductCombinations.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        getRequestForPriceProductCombinations.fulfilled,
        (state, action) => {
          state.loading = "fulfilled";
          state.requestForPriceProductCombinations = action.payload;
        }
      )
      .addCase(
        getRequestForPriceProductCombinations.rejected,
        (state, action) => {
          state.loading = "rejected";
          state.error = action.error.message;
        }
      )

      //Get RaiseAQuery Details

      .addCase(fetchRaiseAQueryDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchRaiseAQueryDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.raiseAQueryDetails = action.payload;
      })
      .addCase(fetchRaiseAQueryDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create RaiseAQuery

      .addCase(createRaiseAQuery.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createRaiseAQuery.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.raiseAQuery.push(action?.payload?.data);
        state.message = action?.payload?.message;
      })
      .addCase(createRaiseAQuery.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update RaiseAQuery

      .addCase(updateRaiseAQuery.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateRaiseAQuery.fulfilled, (state, action) => {
        const payload = action?.payload;
        if (payload && payload._id) {
          const index = state.allRequestForPriceProduct.findIndex(
            (raiseAQuery) =>
              raiseAQuery?._id?.toString() === payload._id.toString()
          );

          if (index !== -1) {
            state.allRequestForPriceProduct[index] = {
              ...state.allRequestForPriceProduct[index],
              discount: payload.discount,
            };
          }
        }

        state.loading = "fulfilled";
      })
      .addCase(updateRaiseAQuery.rejected, (state) => {
        state.loading = "rejected";
      })

      .addCase(architectCountById.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(architectCountById.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.reqForPriseCount = action?.payload;
      })
      .addCase(architectCountById.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete RaiseAQuery

      .addCase(deleteRaiseAQuery.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteRaiseAQuery.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.allRequestForPriceProduct =
          state.allRequestForPriceProduct.filter(
            (raiseAQuery) => raiseAQuery._id !== action.payload
          );
      })
      .addCase(deleteRaiseAQuery.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default raiseAQuerySlice.reducer;
