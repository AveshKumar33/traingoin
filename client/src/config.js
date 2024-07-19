import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `http://localhost:8002`,
  // baseURL: `https://railingo.com`,

  withCredentials: true,

  //   baseURL : `http://railingonew.rankarts.in`
});

export const REACT_APP_URL = "http://localhost:8002";
// export const REACT_APP_URL = "https://railingo.com";
// export const REACT_APP_URL = "http://3.108.31.154";

export const RAZORPAY_KEY_ID = `rzp_test_6Qt6OKUp5i3ADO`;
