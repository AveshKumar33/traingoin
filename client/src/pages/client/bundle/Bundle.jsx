import React, { useCallback, useEffect } from "react";
import { fetchProductBundle } from "../../../redux/slices/bundleSlice";
import Preloader from "../../../components/preloader/Preloader";
import { useDispatch, useSelector } from "react-redux";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import HeaderImage from "../../../assets/Image/Slider11.jpg";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainFooter from "../../../components/mainfooter/MainFooter";
import BundleCard from "./BundleCard";
import { toastError } from "../../../utils/reactToastify";
import { axiosInstance, REACT_APP_URL } from "../../../config";

const Bundle = () => {
  const { loading, productBundle } = useSelector(
    (state) => state.productBundle
  );
  const dispatch = useDispatch();
  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/Bundle`
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
    dispatch(fetchProductBundle());
  }, [dispatch]);

  if (loading === "pending") {
    return <Preloader />;
  }

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
       
      </div>{" "}
      <div className="row">
        {loading === "fulfilled" &&
          productBundle &&
          productBundle.map((p, index) => (
            <>
              <BundleCard key={p._id} p={p} />
            </>
          ))}
      </div>
      <MainFooter />
    </>
  );
};

export default Bundle;
