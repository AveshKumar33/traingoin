import React, { useCallback, useEffect, useState } from "react";
// import HeaderImage from "../../../assets/Image/Slider11.jpg";
import MainFooter from "../../../components/mainfooter/MainFooter";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import { fetchOrderDetailsByUserId } from "../../../redux/slices/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { REACT_APP_URL, axiosInstance } from "../../../config";
import { toastError } from "../../../utils/reactToastify";
// import { Link } from "react-router-dom";
import OrderList from "../../../components/order/OrderList";
import Preloader from "../../../components/preloader/Preloader";

function UserOrders() {
  const { loading, useOrders } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const [allOrders, setAllOrders] = useState([]);
  const [headerImage, setHeaderImage] = useState({});

  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/UserOrders`
      );
      if (data?.success) {
        setHeaderImage(data?.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        toastError(error?.response?.data?.message);
      } else {
        toastError(error?.message);
      }
    }
  }, []);
  useEffect(() => {
    fetchRootCollection();
  }, [fetchRootCollection]);

  useEffect(() => {
    if (loading === "fulfilled" && useOrders) {
      setAllOrders(useOrders);
    }
  }, [loading, useOrders]);

  useEffect(() => {
    dispatch(fetchOrderDetailsByUserId());
  }, [dispatch]);

  return (
    <>
      <StickySidebar />
      <MainHeader isImageAvailable={headerImage?.pngImage ? true : false} />
      <div
        className="div"
        style={{
          height: headerImage?.pngImage ? "60vh" : "11vh",
          overflow: "hidden",
          position: "relative",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(${REACT_APP_URL}/images/header/${headerImage?.pngImage})`,
          backgroundSize: "cover",
        }}
      ></div>
      <div className="gradient-overlay" />
      <div className="col-lg-2" style={{ float: "left" }}>
        &nbsp;
      </div>
      <div className="col-lg-2" style={{ float: "left" }}>
        &nbsp;
      </div>

      {/* <br /> */}

      {loading === "pending" ? (
        <Preloader />
      ) : allOrders && allOrders?.length > 0 ? (
        <OrderList allOrders={allOrders} />
      ) : (
        <p style={{ textAlign: "center" }}>No Orders To Show </p>
      )}

      <MainFooter />
    </>
  );
}

export default UserOrders;
