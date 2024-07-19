import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";

// const config = {
//   headers: {
//     "Content-Type": "application/json",
//   },
// };

// const formdataconfig = {
//   headers: {
//     "Content-Type": "multipart/form-data",
//   },
// };

//login User
export const login = createAsyncThunk(
  "authusers/login",
  async (userdata, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/api/user/login", userdata);
      // alert(data.message);

      if (data?.success) {
        toastSuceess(data?.message);
      }

      return data.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        toastError(error?.response?.data?.message);
        return rejectWithValue(error.response.data.message);
      } else {
        toastError(error.message);
        return rejectWithValue(error.message);
      }
    }
  }
);

//OTp VERify
export const otpVerify = createAsyncThunk(
  "authusers/otpVerify",
  async (userdata, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/user/verify-otp",
        userdata
      );
      // alert(data.message);

      return data.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
        return rejectWithValue(error.response.data.message);
      } else {
        alert(error.message);
        return rejectWithValue(error.message);
      }
    }
  }
);

export const verifyToken = createAsyncThunk(
  "authusers/verifyToken",
  async () => {
    try {
      const { data } = await axiosInstance.get("api/user/profile/me", {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      if (data?.success) {
        return data.data;
      }
      if (!data.success) {
        // alert(data.message)
        localStorage.removeItem("token");
      }
    } catch (error) {
      localStorage.clear();
      return toastError(error.response.data.message);
    }
  }
);

export const otpSent = createAsyncThunk(
  "authusers/otpSent",
  async (userdata, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/api/user/otp-sent", userdata);

      if (data.success) {
        return data.data;
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        // alert(error.response.data.message);
        // localStorage.clear();
        return rejectWithValue(error.response.data.message);
      } else {
        // alert(error.message);
        // localStorage.clear();
        return rejectWithValue(error.message);
      }
    }
  }
);

let userToken = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : null;

const authSlice = createSlice({
  name: "authusers",
  initialState: {
    loading: "idle",
    error: null,
    success: false,
    message: "",
    userdetails: {},
    userToken,
    auth: false,
    lastUpdated: null,
  },
  reducers: {
    logout: (state, action) => {
      state.loading = "idle";
      state.error = null;
      state.success = false;
      state.message = "";
      state.userdetails = {};
      state.userToken = null;
      state.auth = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      //Login User
      .addCase(login.pending, (state) => {
        state.loading = "pending";
        state.auth = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

        const { token, ...user } = action.payload;
        state.loading = "fulfilled";
        state.userdetails = user;
        state.userToken = token;
        state.error = null;
        localStorage.setItem("token", token);
        state.auth = true;
        state.lastUpdated = Date.now() + sevenDaysInMillis;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
        state.auth = false;
      })

      //Token Verification
      .addCase(verifyToken.pending, (state) => {
        state.loading = "pending";
        state.auth = false;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.userdetails = action.payload;
        state.userToken = localStorage.getItem("token");
        state.error = null;
        state.auth = true;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
        state.userToken = null;
        state.auth = false;
      })

      // OTp Sent

      .addCase(otpSent.pending, (state) => {
        state.loading = "pending";
        state.auth = false;
      })
      .addCase(otpSent.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.message = "Otp Sent Successfully";
      })
      .addCase(otpSent.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
        state.userToken = null;
        state.auth = false;
      })

      //Verify  OTP
      .addCase(otpVerify.pending, (state) => {
        state.loading = "pending";
        state.auth = false;
      })
      .addCase(otpVerify.fulfilled, (state, action) => {
        const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        const { token, ...user } = action.payload;
        state.loading = "fulfilled";
        state.userdetails = user;
        state.userToken = token;
        state.error = null;
        localStorage.setItem("token", token);
        state.auth = true;
        state.lastUpdated = Date.now() + sevenDaysInMillis;
      })
      .addCase(otpVerify.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
        state.auth = false;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
