import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";

export const fetchCatalogue = createAsyncThunk(
  "Catalogue/fetchCatalogue",
  async () => {
    const { data } = await axiosInstance.get("/api/catalogue");
    return data.data;
  }
);

export const fetchCatalogueDetails = createAsyncThunk(
  "Catalogue/fetchCatalogueDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/catalogue/${id}`);

      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
      console.log(error.response.data.message);
    }
  }
);

export const createCatalogue = createAsyncThunk(
  "Catalogue/createCatalogue",
  async (Cataloguedata) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/catalogue",
        Cataloguedata,
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

export const updateCatalogue = createAsyncThunk(
  "Catalogue/updateCatalogue",
  async (updateddata) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/catalogue/${updateddata.id}`,
        updateddata.catalogueData,
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
      toastError(error?.response?.data?.message);
    }
  }
);

export const deleteCatalogue = createAsyncThunk(
  "Catalogue/deleteCatalogue",
  async (CatalogueId) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/catalogue/${CatalogueId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data?.success) {
        toastSuceess(data?.message);
      }

      return CatalogueId;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

const CatalogueSlice = createSlice({
  name: "Catalogue",
  initialState: {
    Catalogue: [],
    loading: "idle",
    error: null,
    message: "",
    Cataloguedetails: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get Catalogue
      .addCase(fetchCatalogue.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCatalogue.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.Catalogue = action.payload;
      })
      .addCase(fetchCatalogue.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get Catalogue Details

      .addCase(fetchCatalogueDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCatalogueDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.Cataloguedetails = action.payload;
      })
      .addCase(fetchCatalogueDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create Catalogue

      .addCase(createCatalogue.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createCatalogue.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.Catalogue.push(action?.payload?.data);
      })
      .addCase(createCatalogue.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update Catalogue

      .addCase(updateCatalogue.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateCatalogue.fulfilled, (state, action) => {
        const index = state.Catalogue.findIndex(
          (Catalogue) => Catalogue._id === action?.payload?._id
        );
        if (index !== -1) {
          state.Catalogue[index] = action.payload;
        }
      })
      .addCase(updateCatalogue.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete Catalogue
      .addCase(deleteCatalogue.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteCatalogue.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.Catalogue = state.Catalogue.filter(
          (Catalogue) => Catalogue._id !== action.payload
        );
      })
      .addCase(deleteCatalogue.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default CatalogueSlice.reducer;
