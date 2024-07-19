import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config";



export const fetchEnquiry = createAsyncThunk(
  "Enquiry/fetchEnquiry",
  async () => {
    const { data } = await axiosInstance.get("/api/enquiry");
    return data.data;
  }
);


export const fetchEnquiryDetails = createAsyncThunk(
  "Enquiry/fetchEnquiryDetails",
  async (id) => {
    try {
      const { data } = await axiosInstance.get(`/api/enquiry/${id}`);
      return data.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
);


export const createEnquiry = createAsyncThunk(
  "Enquiry/createEnquiry",
  async (enquirydata) => {
    try {
      const {data} = await axiosInstance.post("/api/enquiry", enquirydata,{

      });
      // const response = await axios.post("http://localhost:7000/api/enquiry", enquirydata);
      return data;
      
    } catch (error) {
      alert(error.response.data.message)
      
    }
  }
);

export const updateEnquiry = createAsyncThunk(
  "Enquiry/updateEnquiry",
  async ({id,enquirydata}) => {
    try {
      const {data} = await axiosInstance.put(
        `/api/enquiry/${id}`,
        enquirydata,
      );
      return data.data;
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const deleteEnquiry = createAsyncThunk(
  "Enquiry/deleteEnquiry",
  async (enquiryId) => {
    await axiosInstance.delete(`/api/enquiry/${enquiryId}`,{
      headers:{
        "token":localStorage.getItem("token")
      }
    });
    return enquiryId;
  }
);

const EnquirySlice = createSlice({
  name: "Enquiry",
  initialState: {
    Enquiry: [],
    loading: "idle",
    error: null,
    message: "",
    enquirydetails:{}
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get Enquiry
      .addCase(fetchEnquiry.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchEnquiry.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.Enquiry = action.payload;
      })
      .addCase(fetchEnquiry.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Get Enquiry Details

      .addCase(fetchEnquiryDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchEnquiryDetails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.enquirydetails = action.payload;
      })
      .addCase(fetchEnquiryDetails.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Create enquiry

      .addCase(createEnquiry.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createEnquiry.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.Enquiry.push(action.payload.data);
      })
      .addCase(createEnquiry.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      //Update enquiry

      .addCase(updateEnquiry.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateEnquiry.fulfilled, (state, action) => {
        const index = state.Enquiry.findIndex(
          (enquiry) => enquiry._id === action.payload._id
        );
        if (index !== -1) {
          state.Enquiry[index] = action.payload;
        }
      })
      .addCase(updateEnquiry.rejected, (state) => {
        state.loading = "rejected";
      })
      
      //Delete enquiry
      .addCase(deleteEnquiry.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteEnquiry.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.Enquiry = state.Enquiry.filter(
          (enquiry) => enquiry._id !== action.payload
        );
      })
      .addCase(deleteEnquiry.rejected, (state) => {
        state.loading = "rejected";
      });
  },
});

export default EnquirySlice.reducer;
