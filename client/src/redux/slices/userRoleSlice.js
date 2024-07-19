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

export const fetchUserRoles = createAsyncThunk(
  "users/Role/fetchUsers",
  async () => {
    try {
      const { data } = await axiosInstance.get("/api/user-role/get-all");
      return data.data;
    } catch (error) {
      toastError(error.response.data.message);
    }
  }
);

export const fetchUsersDetails = createAsyncThunk(
  "users/fetchUsersDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/user/${id}`);
      return data.data;
    } catch (error) {
      toastError(error.response.data.message);
    }
  }
);

export const createUserRole = createAsyncThunk(
  "users/createUserRole",
  async (userdata) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/user-role/create",
        userdata
      );

      if (data?.success) {
        toastSuceess(data.message);
      }

      return data;
    } catch (error) {
      toastError(error.response.data.message);
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

      return data.data;
    } catch (error) {
      toastError(error.response.data.message);
    }
  }
);

export const deleteUserRole = createAsyncThunk(
  "users/deleteUser",
  async (userId) => {
    try {
      const { data } = await axiosInstance.delete(`/api/user-role/${userId}`);

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

const userRolesSlice = createSlice({
  name: "userRoles",
  initialState: {
    userRoles: [],
    loading: "idle",
    error: null,
    success: false,
    message: "",
    userdetails: {},
    userRoleId: null,
    // userToken,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get users
      .addCase(fetchUserRoles.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchUserRoles.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.userRoles = action.payload;
      })
      .addCase(fetchUserRoles.rejected, (state, action) => {
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

      //Create user role

      .addCase(createUserRole.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createUserRole.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.success = true;
      })
      .addCase(createUserRole.rejected, (state, action) => {
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
      .addCase(deleteUserRole.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteUserRole.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.userRoleId = action.payload;
      })
      .addCase(deleteUserRole.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action?.error?.message;
      });
  },
});

export default userRolesSlice.reducer;
