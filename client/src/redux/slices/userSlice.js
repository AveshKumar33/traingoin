import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";
import { toastError, toastSuceess } from "../../utils/reactToastify";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  try {
    const { data } = await axiosInstance.get("/api/user");
    return data.data;
  } catch (error) {
    toastError(error?.response?.data?.message);
  }
});

export const fetchUsersDetails = createAsyncThunk(
  "users/fetchUsersDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/user/${id}`);
      return data.data;
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (userdata) => {
    try {
      const { data } = await axiosInstance.post("/api/user", userdata);

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

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userdata }) => {
    try {
      const { data } = await axiosInstance.put(`/api/user/${id}`, userdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data?.success) {
        toastSuceess(data.message);
      }

      return data;
    } catch (error) {
      console.log("first", error);
      toastError(error.response.data.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId) => {
    try {
      const { data } = await axiosInstance.delete(`/api/user/${userId}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data?.success) {
        toastSuceess(data.message);
      }

      return userId;
    } catch (error) {
      toastError(error.response.data.message);
    }
  }
);

// let userToken = localStorage.getItem("token")
//   ? localStorage.getItem("token")
//   : null;

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: "idle",
    error: null,
    success: false,
    message: "",
    userdetails: {},
    userId: null,
    // userToken,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get users Details

      .addCase(fetchUsersDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchUsersDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.userdetails = action.payload;
      })
      .addCase(fetchUsersDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create user

      .addCase(createUser.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(updateUser.rejected, (state) => {
        state.loading = "rejected";
      })

      //Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.userId = action.payload;
      })
      .addCase(deleteUser.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default userSlice.reducer;
