import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastSuceess } from "../../utils/reactToastify";

export const fetchArchitect = createAsyncThunk(
  "Architect/fetchArchitect",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/architech");
      return data.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const fetchArchitectDetails = createAsyncThunk(
  "Architect/fetchArchitectDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/architech/${id}`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      return data.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const createArchitect = createAsyncThunk(
  "Architect/createArchitect",
  async (enquirydata, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/api/architech", enquirydata, {
        headers: {
          "Content-type": "multipart/form-data",
          token: localStorage.getItem("token"),
        },
      });
      // const { data } = await axiosInstance.post("/api/architech", enquirydata);

      if (data?.success) {
        toastSuceess(data?.message);
      }

      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updateArchitect = createAsyncThunk(
  "Architect/updateArchitect",
  async ({ id, enquirydata }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/architech/${id}`,
        enquirydata,
        {
          headers: {
            "Content-type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data?.success) {
        toastSuceess(data?.message);
      }

      return data.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const changeArchitectPassword = createAsyncThunk(
  "Architect/changeArchitectPassword",
  async (architectData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        "/api/architech/change-password",
        architectData,
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
      console.log("error", error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const deleteArchitect = createAsyncThunk(
  "Architect/deleteArchitect",
  async (enquiryId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/architech/${enquiryId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        toastSuceess(data?.message);
      }

      return enquiryId;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const Architectlogin = createAsyncThunk(
  "Architect/Architectlogin",
  async (formdata, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/architech/login`,
        formdata
      );
      return data.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const removeProduct = createAsyncThunk(
  "Architect/removeProduct",
  async ({ id, architectdata }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/architech/product/${id}`,
        architectdata
      );

      return data.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getArchitectByUrl = createAsyncThunk(
  "Architect/getArchitectByUrl",
  async (url, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/architech?Url=${url}`);
      return data.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const logoutArchitect = createAsyncThunk(
  "Architect/logoutArchitect",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/api/architech/logout");

      return data.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const VerifyArchitect = createAsyncThunk(
  "Architect/VerifyArchitect",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/api/architech/verifyToken");

      return data.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const architectSlice = createSlice({
  name: "architect",
  initialState: {
    architects: [],
    loading: "idle",
    error: null,
    success: false,
    message: "",
    architectsdetails: {},
    ArchitectAuth: false,
  },
  reducers: {
    resetState: (state) => {
      state.error = null;
      state.loading = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArchitect.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchArchitect.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.architects = action.payload;
        state.error = null;
      })
      .addCase(fetchArchitect.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      })
      .addCase(fetchArchitectDetails.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })

      .addCase(fetchArchitectDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.architectsdetails = action.payload;
      })
      .addCase(fetchArchitectDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      })
      .addCase(createArchitect.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(createArchitect.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        // state.architects.push(action.payload.data);
        state.error = null;
      })
      .addCase(createArchitect.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      })
      .addCase(updateArchitect.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(updateArchitect.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        // const index = state.architects.findIndex(
        //   (enquiry) => enquiry._id === action.payload._id
        // );
        // if (index !== -1) {
        //   state.architects[index] = action.payload;
        // }
        state.architectsdetails = action.payload;
      })

      .addCase(updateArchitect.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      })

      .addCase(deleteArchitect.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(deleteArchitect.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.architects = state.architects.filter(
          (enquiry) => enquiry._id !== action.payload
        );
      })
      .addCase(deleteArchitect.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      })

      //Architect Login

      .addCase(Architectlogin.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
        state.ArchitectAuth = false;
      })
      .addCase(Architectlogin.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.architectsdetails = action.payload;
        state.ArchitectAuth = true;
      })
      .addCase(Architectlogin.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
        state.ArchitectAuth = false;
      })

      //Remove Product From Architect Dashboard
      .addCase(removeProduct.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.architectsdetails = action.payload;
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      })

      //Get getArchitectByUrl

      .addCase(getArchitectByUrl.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(getArchitectByUrl.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.architectsdetails = action.payload[0];
      })
      .addCase(getArchitectByUrl.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      })

      .addCase(logoutArchitect.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(logoutArchitect.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.architectsdetails = null;
        state.ArchitectAuth = null;
      })
      .addCase(logoutArchitect.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      })

      //Verify User

      .addCase(VerifyArchitect.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
        state.ArchitectAuth = false;
      })
      .addCase(VerifyArchitect.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.architectsdetails = action.payload;
        state.ArchitectAuth = true;
      })
      .addCase(VerifyArchitect.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
        state.ArchitectAuth = false;
      })

      // change password
      .addCase(changeArchitectPassword.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(changeArchitectPassword.fulfilled, (state) => {
        state.loading = "fulfilled";
      })
      .addCase(changeArchitectPassword.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export const { resetState } = architectSlice.actions;

export default architectSlice.reducer;
