import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";

export const fetchCollections = createAsyncThunk(
  "collections/fetchCollections",
  async () => {
    try {
      const { data } = await axiosInstance.get("/api/collection");
      return data?.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchCollectionsDetails = createAsyncThunk(
  "collections/fetchCollectionsDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/collection/${id}`);
      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);
export const fetchMostSellingCollections = createAsyncThunk(
  "collections/fetchMostSellingCollections",
  async () => {
    try {
      const { data } = await axiosInstance.get(`/api/collection/most/selling`);
      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const fetchCollectionsDetailsByUrl = createAsyncThunk(
  "collections/fetchCollectionsDetailsByUrl",
  async (url) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/collection/collectiondetails/${url}`
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);
/**get data by url */
export const getCollectionDataByUrl = createAsyncThunk(
  "collections/getCollectionDataByUrl",
  async (url) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/collection/url-name/${url}`
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

/** get child collection of any collection by _id */
export const fetchChildCollectionsDetails = createAsyncThunk(
  "collections/fetchChildCollectionsDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/collection/get-all-child-collection/${id}`
      );

      return data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const createCollection = createAsyncThunk(
  "collections/createCollection",
  async (collectiondata) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/collection",
        collectiondata,
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

export const updateCollection = createAsyncThunk(
  "collections/updateCollection",
  async ({ id, collectiondata }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/collection/${id}`,
        collectiondata,
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

export const deleteCollection = createAsyncThunk(
  "collections/deleteCollection",
  async (collectionId) => {
    try {
      await axiosInstance.delete(`/api/collection/${collectionId}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      return collectionId;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

const collectionSlice = createSlice({
  name: "collections",
  initialState: {
    collections: [],
    loading: "idle",
    error: null,
    message: "",
    collectiondetails: {},
    collectionData: [],
    products: [],
    productsCombinations: [],
    allChildCollections: [],
    mostSellingCollections: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get collections
      .addCase(fetchCollections.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.collections = action.payload;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get collections Details

      .addCase(fetchCollectionsDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCollectionsDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.collectiondetails = action.payload.data;
        state.products = action.payload.products;
      })
      .addCase(fetchCollectionsDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })
      /**get most selling collections  */
      .addCase(fetchMostSellingCollections.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchMostSellingCollections.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.mostSellingCollections = action.payload.data;
      })
      .addCase(fetchMostSellingCollections.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get Collection Details By url
      .addCase(fetchCollectionsDetailsByUrl.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCollectionsDetailsByUrl.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.collectiondetails = action.payload.data;
        state.products = action.payload.products;
        state.productsCombinations = action.payload.productsCombinations;
      })
      .addCase(fetchCollectionsDetailsByUrl.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })
      //Get child Collection Details By _id
      .addCase(fetchChildCollectionsDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchChildCollectionsDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.allChildCollections = action?.payload?.data;
      })
      .addCase(fetchChildCollectionsDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get child Collection Deta By url
      .addCase(getCollectionDataByUrl.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getCollectionDataByUrl.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.collectiondetails = action?.payload?.data;
        state.collectionData = action?.payload?.data;
      })
      .addCase(getCollectionDataByUrl.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create collection

      .addCase(createCollection.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.collections.push(action.payload);
      })
      .addCase(createCollection.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update collection

      .addCase(updateCollection.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateCollection.fulfilled, (state, action) => {
        const index = state?.collections?.findIndex(
          (collection) => collection?._id === action?.payload?._id
        );
        if (index !== -1) {
          state.collections[index] = action.payload;
        }
      })
      .addCase(updateCollection.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete collection
      .addCase(deleteCollection.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteCollection.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.collections = state.collections.filter(
          (collection) => collection?._id !== action.payload
        );
      })
      .addCase(deleteCollection.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default collectionSlice.reducer;
