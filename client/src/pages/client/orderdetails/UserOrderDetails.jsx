import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { axiosInstance, REACT_APP_URL } from "../../../config";
import { toastError } from "../../../utils/reactToastify";
import MainFooter from "../../../components/mainfooter/MainFooter";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainHeader from "../../../components/mainheader/MainHeaderNew";

import Preloader from "../../../components/preloader/Preloader";
import OrderProducts from "../../../components/order/OrderProducts";
import { fetchOrderProductById } from "../../../redux/slices/orderSlice";

const UserOrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const [headerImage, setHeaderImage] = useState({});

  const {
    loading,
    orderProducts,
    singleProducts,
    customizeProducts,
    singleDotProducts,
    customizeDotProducts,
    customizeComboProducts,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderProductById(orderId));
    }
  }, [dispatch, orderId]);

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
      <div
        className="row"
        style={{
          //   backgroundImage: `url(${BackgroundImageLightRight})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          // paddingTop: "50px",
        }}
      >
        {loading === "pending" ? (
          <Preloader />
        ) : (
          <OrderProducts
            orderProducts={
              orderProducts && orderProducts?.length > 0 ? orderProducts[0] : []
            }
            singleProducts={singleProducts}
            customizeProducts={customizeProducts}
            singleDotProducts={singleDotProducts}
            customizeDotProducts={customizeDotProducts}
            customizeComboProducts={customizeComboProducts}
            isAdmin={false}
          />
        )}
      </div>
      <br></br>
      <MainFooter />
    </>
  );
};

export default UserOrderDetails;
