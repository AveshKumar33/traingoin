import React, { useCallback, useEffect, useState } from "react";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import MainFooter from "../../../components/mainfooter/MainFooter";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import { toastError } from "../../../utils/reactToastify";
import { axiosInstance, REACT_APP_URL } from "../../../config";

const AllCustomizedProduct = () => {
  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/AllCustomizedProduct`
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
      >
        
      </div>

      <MainFooter />
    </>
  );
};

export default AllCustomizedProduct;
