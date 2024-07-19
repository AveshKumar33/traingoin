import React, { useEffect, useState, useCallback } from "react";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { useDispatch, useSelector } from "react-redux";
import CustomizedCombinationCard from "./CustomizedCombinationCard";
import Preloader from "../../../components/preloader/Preloader";
import { fetchAllCustomizedComboProductRectangle } from "../../../redux/slices/customizeComboRectangleSlice";
import { axiosInstance } from "../../../config";
import { toastError } from "../../../utils/reactToastify";
import { REACT_APP_URL } from "../../../config";
import { fetchWishlistCustomizedComboProducts } from "../../../redux/slices/newWishlistSlice";

const CustomizedCombination = () => {
  const { loading, customizedComboRectangle } = useSelector(
    (state) => state.customizeComboRectangle
  );

  const { whishlistdata } = useSelector((state) => state.whishlist);
  const { customizedComboProducts, loading: wishlistProductLoading } =
    useSelector((state) => state.wishlist);
  const { userdetails } = useSelector((state) => state.auth);

  // const { loading, dotProductdetails } = useSelector(
  //   (state) => state.dotCustomizedproduct
  // );

  const dispatch = useDispatch();

  const [productDetails, setProductDetails] = useState([]);
  const [wishlistData, setWishlistData] = useState([]);
  const [headerImage, setHeaderImage] = useState({});

  useEffect(() => {
    dispatch(fetchAllCustomizedComboProductRectangle());
  }, [dispatch]);

  useEffect(() => {
    if (userdetails && Object.keys(userdetails).length > 0) {
      dispatch(
        fetchWishlistCustomizedComboProducts({ userId: userdetails?._id })
      );
    }
  }, [dispatch, userdetails]);

  useEffect(() => {
    if (
      customizedComboProducts &&
      userdetails &&
      Object.keys(userdetails).length > 0 &&
      wishlistProductLoading === "fulfilled"
    ) {
      setWishlistData(customizedComboProducts);
    } else if (Object.keys(userdetails).length === 0 && whishlistdata) {
      setWishlistData(whishlistdata);
    }
  }, [
    userdetails,
    wishlistProductLoading,
    customizedComboProducts,
    whishlistdata,
  ]);

  useEffect(() => {
    if (loading === "fulfilled" && customizedComboRectangle?.length > 0) {
      // customizedComboRectangle?.map(comboRectangle=>{
      //   return comboRectangle?.rectangles?.map(rectangle=>{
      //     rectangle?.customizedProductDetails =
      //   })
      // })
      setProductDetails(customizedComboRectangle);
    }
  }, [loading, customizedComboRectangle]);

  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/Customized Elevation`
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
      ></div>
      <div className="row px-2 mb-2">
        {productDetails &&
          productDetails?.length > 0 &&
          productDetails.map((p) => (
            <CustomizedCombinationCard
              id={p?._id}
              product={p}
              Name={"p.name"}
              Image={"p.ProductImage"}
              Dots={"p.dots"}
              key={p?._id}
              selectedCustomizedProduct={p?.rectangles}
              wishlistData={wishlistData}
              // setTotalPrice={setTotalPrice}
            />
          ))}
      </div>
      <MainFooter />
    </>
  );
};

export default CustomizedCombination;
