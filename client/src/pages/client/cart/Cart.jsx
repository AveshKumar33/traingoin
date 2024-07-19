import React, { useReducer, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

// import HeaderImage from "../../../assets/Image/Slider11.jpg";
import MainFooter from "../../../components/mainfooter/MainFooter";
import BackgroundImageLightRight from "../../../assets/Image/BackgroundImageLightRight.png";
import { removeTocart } from "../../../redux/slices/cartSlice";
import {
  fetchCartSingleProducts,
  fetchCartCustomizedProducts,
  fetchCartDotProducts,
  fetchCartCustomizedComboProducts,
  deleteFromCart,
  cartProductMoveToWishlist,
} from "../../../redux/slices/newCartSlice";

import Button from "@mui/material/Button";

// import { fetchWishlistForProductList } from "../../../redux/slices/newWishlistSlice";

// import headerImage from "../../../assets/Image/Slider11.jpg";

import "./styles.css";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import { FinialAmount } from "../../../utils/usefullFunction";
import { getPriceForWishlist } from "../../../utils/varientimge/getPrice";

import { useLocation, useNavigate } from "react-router-dom";

import {
  setCartCheckoutItem,
  setCartCheckoutProductPrice,
} from "../../../redux/slices/cartSlice";

import SnackbarMessage from "../../../utils/snakbar/SnackbarMessage";
import SingleProductCard from "./SingleProductCard";
import CustomizeProductCard from "./CustomizeProductCard";
import SingleDotProductCard from "./SingleDotProductCard";
import CustomizeDotProductCard from "./CustomizeDotProductCard";
import CustomizedCombinationCard from "./CustomizedCombinationCard";
// import ProductCustomizedProduct from "../../pages/client/productdetails/customizedproduct/ProductCustomizedProduct";

import { Slide, Fade } from "@mui/material";
import { axiosInstance, REACT_APP_URL } from "../../../config";
import { toastError } from "../../../utils/reactToastify";

import Animations from "../../../utils/Skeleton/Animation";

function SlideTransition(props) {
  return (
    <Slide {...props} direction="up" vertical="bottom" horizontal="center" />
  );
}

const filterProductPrice = (pricesObject, isLoggedIn) => {
  const mongoObjectIdPattern = /^[a-f\d]{24}$/i;

  if (pricesObject && Object.keys(pricesObject).length === 0) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(pricesObject).filter(([key]) =>
      isLoggedIn
        ? mongoObjectIdPattern.test(key)
        : !mongoObjectIdPattern.test(key)
    )
  );
};

const initialState = {
  cartSingleProducts: [],
  customizeProducts: [],
  dotProducts: [],
  cartDotProducts: [],
  customizedComboProducts: [],
  totalPrice: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CART_SINGLE_PRODUCT":
      return { ...state, cartSingleProducts: action.payload };
    case "SET_CART_CUSTOMIZE_PRODUCT":
      return { ...state, customizeProducts: action.payload };
    case "SET_CART_DOT_PRODUCT":
      return { ...state, dotProducts: action.payload };
    case "SET_CART_PRODUCT":
      return { ...state, cartDotProducts: action.payload };
    case "SET_CART_CUSTOMIZED_COMBO_PRODUCT":
      return { ...state, customizedComboProducts: action.payload };
    case "SET_TOTAL_PRICE":
      return { ...state, totalPrice: action.payload };
    case "DELETE_CART_PRODUCT":
      const { id, productType } = action.payload;
      return {
        ...state,
        [productType]: state[productType].filter((item) => item?._id !== id),
      };
    default:
      return state;
  }
};

const calculateCustomizedPrice = (
  productDetails,
  combinations,
  priceFor,
  { width, height }
) => {
  if (productDetails && combinations?.length > 0) {
    // const { DefaultWidth, DefaultHeight } = productDetails || {};

    const totalCustomizedPrice =
      productDetails[priceFor] +
      getPriceForWishlist(productDetails, combinations, {
        DefaultWidth: width,
        DefaultHeight: height,
      });

    return totalCustomizedPrice;
  }
  return 0;
};

const Cart = () => {
  const dispatch = useDispatch();

  const [state, dispatchState] = useReducer(reducer, initialState);
  const { cartdata } = useSelector((state) => state.cart);
  const [productPrice, setProductPrice] = useState({});

  const {
    singleProduct,
    singleProductLoading,
    customizeProduct,
    customizeProductLoading,
    dotProduct,
    cartDotProduct,
    dotProductLoading,
    customizedComboProduct,
    customizedComboProductLoading,
  } = useSelector((state) => state.newCartSlice);

  const { userdetails } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const location = useLocation();
  const {
    cartSingleProducts,
    totalPrice,
    customizeProducts,
    dotProducts,
    customizedComboProducts,
  } = state;

  const [message, setMessage] = React.useState({
    open: false,
    Transition: Fade,
    type: "",
    message: "",
  });
  const [headerImage, setHeaderImage] = useState({});

  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`/api/header-image/title/cart`);
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
    const isEmptyUserDetails =
      !userdetails || Object.keys(userdetails).length === 0;
    const userId = isEmptyUserDetails ? "unauthenticated" : userdetails._id;

    Promise.all([
      dispatch(
        fetchCartSingleProducts({
          product: isEmptyUserDetails ? cartdata : [],
          userId,
        })
      ),
      dispatch(
        fetchCartCustomizedProducts({
          product: isEmptyUserDetails ? cartdata : [],
          userId,
        })
      ),
      dispatch(
        fetchCartDotProducts({
          product: isEmptyUserDetails ? cartdata : [],
          userId,
        })
      ),
      dispatch(
        fetchCartCustomizedComboProducts({
          product: isEmptyUserDetails ? cartdata : [],
          userId,
        })
      ),
    ]);
  }, [dispatch, userdetails, cartdata]);

  // console.log("cartdata", cartdata);

  // single product
  useEffect(() => {
    if (singleProductLoading === "fulfilled" && singleProduct) {
      dispatchState({
        type: "SET_CART_SINGLE_PRODUCT",
        payload: singleProduct,
      });
    }
  }, [singleProductLoading, singleProduct]);

  // customize product
  useEffect(() => {
    if (customizeProductLoading === "fulfilled" && customizeProduct) {
      dispatchState({
        type: "SET_CART_CUSTOMIZE_PRODUCT",
        payload: customizeProduct,
      });
    }
  }, [customizeProductLoading, customizeProduct]);

  // dot product
  useEffect(() => {
    if (dotProductLoading === "fulfilled" && dotProduct && cartDotProduct) {
      dispatchState({
        type: "SET_CART_DOT_PRODUCT",
        payload: dotProduct,
      });
      dispatchState({
        type: "SET_CART_PRODUCT",
        payload: cartDotProduct,
      });
    }
  }, [dotProductLoading, dotProduct, cartDotProduct]);

  // customized Combo product
  useEffect(() => {
    if (
      customizedComboProductLoading === "fulfilled" &&
      customizedComboProduct
    ) {
      dispatchState({
        type: "SET_CART_CUSTOMIZED_COMBO_PRODUCT",
        payload: customizedComboProduct,
      });
    }
  }, [customizedComboProduct, customizedComboProductLoading]);

  const hasProducts =
    (cartSingleProducts && cartSingleProducts.length > 0) ||
    (customizeProducts && customizeProducts.length > 0) ||
    (dotProducts && dotProducts.length > 0) ||
    (customizedComboProducts && customizedComboProducts.length > 0);

  useEffect(() => {
    if (hasProducts) {
      const productArr = [];

      for (let singleProduct of cartSingleProducts) {
        productArr.push({
          _id: singleProduct?._id,
          name: singleProduct?.singleProductId?.ProductName,
          quantity: singleProduct?.quantity,
          product: singleProduct,
        });
      }

      for (let cusProduct of customizeProducts) {
        productArr.push({
          _id: cusProduct?._id,
          name: cusProduct?.customizeProduct?.ProductName,
          quantity: cusProduct?.quantity,
          product: cusProduct,
        });
      }

      for (let dotProduct of dotProducts) {
        productArr.push({
          _id: dotProduct?._id,
          name: dotProduct?.name,
          quantity: dotProduct?.quantity,
          product: dotProduct,
        });
      }

      for (let cusComboProduct of customizedComboProducts) {
        productArr.push({
          _id: cusComboProduct?._id,
          name: cusComboProduct?.customizedComboId?.Name,
          quantity: cusComboProduct?.quantity,
          product: cusComboProduct,
        });
      }

      dispatch(setCartCheckoutItem(productArr));
    }
  }, [
    dispatch,
    cartSingleProducts,
    customizeProducts,
    dotProducts,
    customizedComboProducts,
    hasProducts,
  ]);

  useEffect(() => {
    let total = 0;

    const isUserDetails = userdetails && Object.keys(userdetails).length > 0;

    const filteredProductPrice = filterProductPrice(
      productPrice,
      isUserDetails
    );

    dispatch(setCartCheckoutProductPrice(filteredProductPrice));

    for (let key in filteredProductPrice) {
      total += productPrice[key];
    }

    dispatchState({
      type: "SET_TOTAL_PRICE",
      payload: total,
    });
  }, [dispatch, productPrice, userdetails]);

  const handleMoveToWishlist = (id, productType) => {
    Promise.all([
      dispatch(cartProductMoveToWishlist(id)),
      // dispatch(fetchWishlistForProductList()),
    ]);
    setProductPrice((prevState) => {
      const newState = { ...prevState };
      delete newState[id];
      return newState;
    });

    dispatchState({
      type: "DELETE_CART_PRODUCT",
      payload: { id, productType },
    });

    setMessage({
      open: true,
      Transition: SlideTransition,
      type: "success",
      message: "Moved to wishlist!",
    });
  };

  const handleDeleteCartItem = (id, productType) => {
    if (userdetails && Object.keys(userdetails).length > 0) {
      dispatch(deleteFromCart(id));
    }

    if (userdetails && Object.keys(userdetails).length === 0) {
      dispatch(removeTocart(id));
    }

    setProductPrice((prevState) => {
      const newState = { ...prevState };
      delete newState[id];
      return newState;
    });
    dispatchState({
      type: "DELETE_CART_PRODUCT",
      payload: { id, productType },
    });

    setMessage({
      open: true,
      Transition: SlideTransition,
      type: "success",
      message: "Deleted From Cart!",
    });
  };

  const handlelogin = () => {
    sessionStorage.setItem("previousPage", location.pathname);
    navigate("/login");
  };

  return (
    <>
      <SnackbarMessage setState={setMessage} state={message} />
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
          backgroundImage: `url(${BackgroundImageLightRight})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          paddingTop: "50px",
        }}
      >
        <div className="container" style={{ width: "1200px" }}>
          <div className="table-responsive CartTableStyle">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th
                    style={{
                      textTransform: "uppercase",
                      width: "10%",
                      backgroundColor: "#475B52",
                      color: "#fff",
                    }}
                  >
                    Image
                  </th>
                  <th
                    style={{
                      textTransform: "uppercase",
                      width: "50%",
                      color: "#fff",
                      backgroundColor: "#475B52",
                    }}
                  >
                    Product Details
                  </th>
                  <th
                    style={{
                      textTransform: "uppercase",
                      textAlign: "center",
                      width: "20%",
                      color: "#fff",
                      backgroundColor: "#475B52",
                    }}
                  >
                    Quantity
                  </th>
                  <th
                    style={{
                      textTransform: "uppercase",
                      textAlign: "right",
                      width: "10%",
                      color: "#fff",
                      backgroundColor: "#475B52",
                    }}
                  >
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {singleProductLoading === "pending" ? (
                  <tr>
                    <td colspan="4">
                      <Animations />
                    </td>
                  </tr>
                ) : (
                  <>
                    {cartSingleProducts &&
                      cartSingleProducts?.length > 0 &&
                      cartSingleProducts.map((product, index) => (
                        <SingleProductCard
                          key={index}
                          index={index}
                          product={product}
                          FinialAmount={FinialAmount}
                          setProductPrice={setProductPrice}
                          handleDeleteCartItem={handleDeleteCartItem}
                          handleMoveToWishlist={handleMoveToWishlist}
                          userdetails={userdetails}
                        />
                      ))}
                  </>
                )}

                {customizeProductLoading === "pending" ? (
                  <tr>
                    <td colspan="4">
                      <Animations />
                    </td>
                  </tr>
                ) : (
                  <>
                    {customizeProducts &&
                      customizeProducts?.length > 0 &&
                      customizeProducts.map((product, index) => (
                        <CustomizeProductCard
                          key={product?._id}
                          calculateCustomizedPrice={calculateCustomizedPrice}
                          product={product?.customizeProduct}
                          customizedproductcardheight={"38vh"}
                          combination={product}
                          setProductPrice={setProductPrice}
                          handleDeleteCartItem={handleDeleteCartItem}
                          handleMoveToWishlist={handleMoveToWishlist}
                          userdetails={userdetails}
                        />
                      ))}
                  </>
                )}

                {dotProductLoading === "pending" ? (
                  <tr>
                    <td colspan="4">
                      <Animations />
                    </td>
                  </tr>
                ) : (
                  <>
                    {dotProducts &&
                      dotProducts?.length > 0 &&
                      dotProducts?.map((p, index) =>
                        p?.type === "singleDotProduct" ? (
                          <SingleDotProductCard
                            key={p._id}
                            product={p}
                            setProductPrice={setProductPrice}
                            handleDeleteCartItem={handleDeleteCartItem}
                            FinialAmount={FinialAmount}
                            handleMoveToWishlist={handleMoveToWishlist}
                            userdetails={userdetails}
                          />
                        ) : (
                          <CustomizeDotProductCard
                            key={p._id}
                            product={p}
                            setProductPrice={setProductPrice}
                            handleDeleteCartItem={handleDeleteCartItem}
                            calculateCustomizedPrice={calculateCustomizedPrice}
                            handleMoveToWishlist={handleMoveToWishlist}
                            userdetails={userdetails}
                            // wishlistData={dotProductWishlist || []}
                            // isProductInWishlist={isCustomizedDotProductInWishlist}
                          />
                        )
                      )}
                  </>
                )}

                {customizedComboProductLoading === "pending" ? (
                  <tr>
                    <td colspan="4">
                      <Animations />
                    </td>
                  </tr>
                ) : (
                  <>
                    {customizedComboProducts &&
                      customizedComboProducts?.length > 0 &&
                      customizedComboProducts.map((product, index) => (
                        <CustomizedCombinationCard
                          key={product?._id}
                          product={product?.customizedComboId}
                          cartData={product}
                          selectedCustomizedProduct={
                            product?.customizedComboRectangle
                          }
                          setProductPrice={setProductPrice}
                          handleDeleteCartItem={handleDeleteCartItem}
                          handleMoveToWishlist={handleMoveToWishlist}
                          userdetails={userdetails}
                        />
                      ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
          <div className="s-cart-bottom">
            <div className="s-cart-row">
              <div
                className="label"
                style={{ fontWeight: "600", fontSize: "20px" }}
              >
                Sub Total :{" "}
              </div>
              <div
                className="price"
                style={{ fontWeight: "600", fontSize: "20px" }}
              >
                ₹{totalPrice}
              </div>
            </div>
            <div className="s-cart-row">
              <div className="label" style={{ fontWeight: "600", color:"#000" }}>
                Taxes and shipping calculated at checkout
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            {hasProducts && (
              <>
                {userdetails && Object.keys(userdetails)?.length > 0 ? (
                  <Button
                    href="/checkout"
                    variant="contained"
                    disabled={false}
                    style={{ backgroundColor: "#475B52", color: "#ffffff" }}
                    sx={{
                      width: { xs: "100%", sm: "fit-content" },
                    }}
                  >
                    Checkout Now
                  </Button>
                ) : (
                  <Button
                    style={{ backgroundColor: "#475B52", color: "#ffffff" }}
                    onClick={handlelogin}
                  >
                    Login To Checkout Now
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <br></br>
      <MainFooter />
    </>
  );
};

export default Cart;
