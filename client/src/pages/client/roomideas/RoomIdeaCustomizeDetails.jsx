import React, { useCallback, useEffect, useState } from "react";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import MainFooter from "../../../components/mainfooter/MainFooter";
import {
  //   addDotProductToCart,
  fetCustomizedchdotPrDductDetails,
} from "../../../redux/slices/newDotCustomizedProductSlice";
import "./RoomIdea.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";

// import { toastSuceess } from "../../../utils/reactToastify";
import Preloader from "../../../components/preloader/Preloader";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import HeaderImage from "../../../assets/Image/Slider11.jpg";
import { Helmet } from "react-helmet";
import RoomCatalogue from "./RoomCatalogue";
// import { FinialAmount, getPercentage } from "../../../utils/usefullFunction";
// import { getAttriutePrice } from "../../../utils/varientimge/getAttributePrice";
import { getPriceForCollectionClient } from "../../../utils/varientimge/getPrice";
import CustomizeProductCard from "./CustomizeProductCard";
import HomeIcon from "@mui/icons-material/Home";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import AddToCartButton from "../../../UI/AddToCartButton";
import SnackbarMessage from "../../../utils/snakbar/SnackbarMessage.jsx";

import {
  addToCart,
  getCartCustomizeDotProduct,
} from "../../../redux/slices/newCartSlice.js";

import { addTocart } from "../../../redux/slices/cartSlice";

import { isCustomizedDotProductInWishlist } from "../../../utils/isInWishlist/isSingleProduct";

import { Slide, Fade } from "@mui/material";
import { axiosInstance, REACT_APP_URL } from "../../../config.js";
import { toastError } from "../../../utils/reactToastify.js";

function SlideTransition(props) {
  return (
    <Slide {...props} direction="up" vertical="bottom" horizontal="center" />
  );
}

const calculateCustomizedPrice = (productDetails, combinations, priceFor) => {
  if (productDetails && combinations?.length > 0) {
    const { DefaultWidth, DefaultHeight } = productDetails || {};

    const totalCustomizedPrice =
      productDetails[priceFor] +
      getPriceForCollectionClient(productDetails, combinations, {
        DefaultWidth,
        DefaultHeight,
      });

    return totalCustomizedPrice;
  }
  return 0;
};

const RoomIdeaCustomizeDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    loading,
    dotCustomizedProductDetails,
    custiomizedProductCombinations,
  } = useSelector((state) => state.newDotCustomization);

  const {
    addedCartProduct,
    cartDotProduct,
    cartDotProductLoading,
  } = useSelector((state) => state.newCartSlice);

  const { cartdata } = useSelector((state) => state.cart);

  const { userdetails } = useSelector((state) => state.auth);

  // const { dotCustomization } = useSelector((state) => state.dotcustomization);

  const [
    custiomizedProdsCombinations,
    setCustiomizedProdsCombination,
  ] = useState();

  const [cartProduct, setCartProduct] = useState(null);
  const [cartProductIds, setCartProductIds] = useState([]);
  const [status, setStatus] = useState("removed");
  const [state, setState] = React.useState({
    open: false,
    Transition: Fade,
    type: "",
    message: "",
  });

  const dispatch = useDispatch();
  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/RoomIdeaCustomizeDetails`
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
    dispatch(fetCustomizedchdotPrDductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (userdetails && Object.keys(userdetails)?.length > 0) {
      dispatch(
        getCartCustomizeDotProduct({
          id: userdetails?._id,
          productId: id,
        })
      );
    }
  }, [dispatch, id, userdetails]);

  useEffect(() => {
    if (
      cartDotProductLoading === "fulfilled" &&
      cartDotProduct &&
      userdetails &&
      Object.keys(userdetails).length > 0
    ) {
      setCartProductIds(cartDotProduct);
    } else if (
      userdetails &&
      cartdata &&
      Object.keys(userdetails).length === 0
    ) {
      const updatedCart = [...cartdata];

      const filteredData = updatedCart.filter(
        (product) => product?.customizeDotProductId
      );

      setCartProductIds(filteredData);
    }
  }, [cartDotProductLoading, cartDotProduct, cartdata, userdetails]);

  useEffect(() => {
    if (addedCartProduct) {
      setCartProductIds((prevState) => [...prevState, addedCartProduct]);
    }
  }, [addedCartProduct]);

  useEffect(() => {
    if (loading === "fulfilled" && custiomizedProductCombinations) {
      setCustiomizedProdsCombination(custiomizedProductCombinations);
    }
  }, [loading, custiomizedProductCombinations]);

  const handleAddTocart = async (productId) => {
    try {
      setStatus("adding");
      const productData = {
        customizeDotProductId: productId,
      };

      if (Object.keys(userdetails)?.length > 0) {
        await dispatch(addToCart(productData)).unwrap();
        setStatus("added");
      } else {
        dispatch(addTocart({ _id: Date.now(), quantity: 1, ...productData })); // saving in local storage
        setStatus("added");
      }

      setState({
        open: true,
        Transition: SlideTransition,
        type: "success",
        message: "Added To Cart!",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (cartProductIds) {
      const product = isCustomizedDotProductInWishlist(
        cartProductIds,
        dotCustomizedProductDetails?._id
      );

      if (product) {
        setStatus("added");
        setCartProduct(product);
      }
    }
  }, [dotCustomizedProductDetails, cartProductIds]);

  if (loading === "pending") {
    return (
      <>
        <Preloader />
      </>
    );
  }

  return (
    <>
      <SnackbarMessage setState={setState} state={state} />

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
        {/* <h3
          style={{
            textAlign: "center",
            color: "#fff",
            marginTop: "150px",
            fontSize: "30px",
            textTransform: "uppercase",
          }}
        >
          Customized Product Details
        </h3> */}
      </div>
      <br></br>
      <p className="py-2" style={{ color: "#222222", paddingLeft: "20px" }}>
        <Link to={`/`} style={{ fontSize: 16, color: "#222222" }}>
          <HomeIcon className="fa-solid fa-house-user" />
        </Link>{" "}
        &nbsp;
        <ChevronRightIcon className="fa fa-chevron-right" />{" "}
        <Link to={`/room-ideas`} style={{ fontSize: 16, color: "#222222" }}>
          room-ideas
        </Link>{" "}
        &nbsp;
        <ChevronRightIcon className="fa fa-chevron-right" />{" "}
        <Link style={{ fontSize: 16, color: "#222222" }}>
          {dotCustomizedProductDetails?.name}
        </Link>{" "}
      </p>
      <Helmet>
        <meta charset="UTF-8" />
        <title>{dotCustomizedProductDetails?.name}</title>
        <meta
          name="description"
          content={dotCustomizedProductDetails?.DescriptionSeo}
        />
        <meta name="keywords" content={dotCustomizedProductDetails?.TitleSeo} />
      </Helmet>
      <div className="px-4">
        <div className="row">
          <div className="col-md-7 col-12 RoomIdeaDetailsMarginBottom">
            <div className="py-2" data-v-1c4374de="">
              <h5
                className="idea-main-title"
                data-v-1c4374de=""
                style={{ textAlign: "center", textTransform: "uppercase" }}
              >
                {dotCustomizedProductDetails?.Title}
              </h5>{" "}
              <br></br>
              <RoomCatalogue
                dotArr={dotCustomizedProductDetails}
                type=""
                model={"customizeDotProduct"}
              />
              <br></br>
              <p style={{ textAlign: "justify", fontSize: "16px" }}>
                {dotCustomizedProductDetails?.Description}
              </p>
            </div>
          </div>
          <div
            className="col-md-5 RoomIdeaDetailsMarginBottom"
            style={{ paddingTop: "7px" }}
          >
            <h5
              className="idea-main-title"
              data-v-1c4374de=""
              style={{ textAlign: "center", textTransform: "uppercase" }}
            >
              Shop By Idea
            </h5>
            <br></br>
            <div className="row">
              {custiomizedProdsCombinations &&
                custiomizedProdsCombinations?.length > 0 &&
                custiomizedProdsCombinations?.map((prod, index) => {
                  return (
                    <div className="col-md-6" key={index}>
                      {/* <h5>{prod?.productId?.ProductName}</h5> */}
                      <CustomizeProductCard
                        key={prod?._id}
                        product={prod}
                        calculateCustomizedPrice={calculateCustomizedPrice}
                        // handleModal={handleModal}
                      />
                    </div>
                  );
                })}
              <div className="text-center mb-1">
                <br></br>
                <AddToCartButton
                  onClick={() => {
                    if (!cartProduct) {
                      handleAddTocart(dotCustomizedProductDetails?._id);
                    } else {
                      navigate("/cart");
                    }
                  }}
                  status={status}
                />
              </div>
            </div>
            {/* 
            {dotCustomization &&
              dotCustomization.length > 0 &&
              dotCustomization.map((p) => (
                <>
                  <h6>Customize Product list</h6>
                  <CustomizeProductCard
                    key={p.id}
                    item={p}
                    deletecartItems={deletecartItems}
                  />
                </>
              ))} */}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <MainFooter />
      </div>
    </>
  );
};

export default RoomIdeaCustomizeDetails;
