import React, { useCallback, useEffect, useState } from "react";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { fetchDotProductDetailsForRoomIdeaDetails } from "../../../redux/slices/dotProductSliceNew";
import "./RoomIdea.css";
// import { REACT_APP_URL } from "../../../config";
import HeaderImage from "../../../assets/Image/Slider11.jpg";

import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";

// import { toastSuceess } from "../../../utils/reactToastify";
import Preloader from "../../../components/preloader/Preloader";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import { Helmet } from "react-helmet";
import RoomCatalogue from "./RoomCatalogue";
// import { FinialAmount, getPercentage } from "../../../utils/usefullFunction";
// import { getAttriutePrice } from "../../../utils/varientimge/getAttributePrice";
import ProductCard from "./ProductCard";
import HomeIcon from "@mui/icons-material/Home";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { addTocart } from "../../../redux/slices/cartSlice";

import {
  addToCart,
  getCartSingleDotProduct,
} from "../../../redux/slices/newCartSlice.js";

import { isSingleDotProductInWishlist } from "../../../utils/isInWishlist/isSingleProduct";
import AddToCartButton from "../../../UI/AddToCartButton.jsx";
import SnackbarMessage from "../../../utils/snakbar/SnackbarMessage.jsx";

import { Slide, Fade } from "@mui/material";
import { toastError } from "../../../utils/reactToastify.js";
import { axiosInstance, REACT_APP_URL } from "../../../config.js";

function SlideTransition(props) {
  return (
    <Slide {...props} direction="up" vertical="bottom" horizontal="center" />
  );
}

const RoomIdeadetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [productDetails, setProductDetails] = useState();

  const { loading, dotProductdetails } = useSelector(
    (state) => state.newDotProduct
  );

  const { cartdata } = useSelector((state) => state.cart);
  const {
    addedCartProduct,
    cartDotProduct,
    cartDotProductLoading,
  } = useSelector((state) => state.newCartSlice);

  const { userdetails } = useSelector((state) => state.auth);

  const [cartProduct, setCartProduct] = useState(null);
  const [cartProductIds, setCartProductIds] = useState([]);
  const [status, setStatus] = useState("removed");
  const [state, setState] = React.useState({
    open: false,
    Transition: Fade,
    type: "",
    message: "",
  });
  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/RoomIdeadetails`
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
        (product) => product?.singleDotProductId
      );

      setCartProductIds(filteredData);
    }
  }, [cartDotProductLoading, cartDotProduct, userdetails, cartdata]);

  useEffect(() => {
    if (addedCartProduct) {
      setCartProductIds((prevState) => [...prevState, addedCartProduct]);
    }
  }, [addedCartProduct]);

  useEffect(() => {
    if (loading === "fulfilled" && dotProductdetails?.length > 0) {
      setProductDetails(dotProductdetails[0]);
    }
  }, [loading, dotProductdetails]);

  useEffect(() => {
    if (userdetails && Object.keys(userdetails)?.length > 0) {
      dispatch(
        getCartSingleDotProduct({
          id: userdetails?._id,
          productId: id,
        })
      );
    }
  }, [dispatch, id, userdetails]);

  let filteredDots = [];
  const allDots =
    productDetails?.dotProductImageIds?.flatMap((p) => p?.dots) || [];
  const uniqueProductIds = new Set();

  filteredDots = allDots.filter((prod) => {
    if (!uniqueProductIds.has(prod.productId._id)) {
      uniqueProductIds.add(prod.productId._id);
      return true;
    }
    return false;
  });

  useEffect(() => {
    dispatch(fetchDotProductDetailsForRoomIdeaDetails(id));
  }, [dispatch, id]);

  const handleAddTocart = async (productId) => {
    try {
      setStatus("adding");
      const productData = {
        singleDotProductId: productId,
      };

      if (userdetails && Object.keys(userdetails)?.length > 0) {
        await dispatch(addToCart(productData)).unwrap();
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
      const product = isSingleDotProductInWishlist(
        cartProductIds,
        productDetails?._id
      );

      if (product) {
        console.log("product", product);
        setCartProduct(product);
        setStatus("added");
      }
    }
  }, [productDetails, cartProductIds]);

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
          Single Product Details
        </h3> */}
        <p className="py-2" style={{ color: "#fff", textAlign: "center" }}>
          <Link to={`/`} style={{ fontSize: 16, color: "#fff" }}>
            <HomeIcon className="fa-solid fa-house-user" />
          </Link>{" "}
          &nbsp;
          <ChevronRightIcon className="fa fa-chevron-right" />{" "}
          <Link to={`/room-ideas`} style={{ color: "#fff", fontSize: 16 }}>
            room-ideas
          </Link>{" "}
          &nbsp;
          <ChevronRightIcon className="fa fa-chevron-right" />{" "}
          <Link style={{ color: "#fff", fontSize: 16 }}>
            {productDetails?.name}
          </Link>{" "}
        </p>
      </div>
      <br></br>
      <Helmet>
        <meta charset="UTF-8" />
        <title>{productDetails?.name}</title>
        <meta name="description" content={productDetails?.DescriptionSeo} />
        <meta name="keywords" content={productDetails?.TitleSeo} />
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
                {productDetails?.Title}
              </h5>{" "}
              <br></br>
              {productDetails && (
                <RoomCatalogue
                  dotArr={productDetails}
                  type={productDetails?.type}
                  model={"dotProduct"}
                />
              )}
              <br></br>
              <p style={{ textAlign: "justify", fontSize: "16px" }}>
                {productDetails?.Description}
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
              {filteredDots.map((prod, index) => {
                return (
                  <div className="col-md-6" key={index}>
                    {/* <h5>{prod.productId.ProductName}</h5> */}
                    <ProductCard key={prod._id} product={prod?.productId} />
                  </div>
                );
              })}
              <div className="text-center mb-1">
                <br></br>
                <AddToCartButton
                  onClick={() => {
                    if (!cartProduct) {
                      handleAddTocart(productDetails?._id);
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

// const CustomizeProductCard = ({ item }) => {
//   return (
//     <>
//       <tbody style={{ backgroundColor: "#FDFCFA" }}>
//         <tr>
//           <td>
//             <img
//               loading="lazy"
//               src={`${REACT_APP_URL}/images/product/${item.img}`}
//               style={{ height: "20vh" }}
//             />
//           </td>
//           <td style={{ width: "70%", paddingLeft: "20px" }}>
//             <span style={{ fontWeight: "800", color: "#475B52" }}>
//               {item.name}
//             </span>{" "}
//             <br />{" "}
//             <span
//               style={{ color: "#463D36", fontWeight: "800", fontSize: "14px" }}
//             >
//               ₹ {item.price / item.quantity}{" "}
//             </span>
//             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
//             <span
//               style={{ fontWeight: "800", fontSize: "14px", color: "#475B52" }}
//             >
//               Quantity : {item.quantity}
//             </span>
//             <span className="badge btn-primary" style={{ fontSize: "10px" }}>
//               {item.sellingType}
//             </span>
//             <br />
//             <DynamicAttribute item={item} />
//           </td>
//         </tr>
//       </tbody>
//     </>
//   );
// };

export default RoomIdeadetails;
