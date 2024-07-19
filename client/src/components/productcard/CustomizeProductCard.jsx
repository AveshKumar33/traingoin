import React, { useState, useEffect } from "react";
import { REACT_APP_URL } from "../../config.js";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/slices/cartSlice.js";
// import CartSidebar from "../cartSidebar/CartSidebar";
// import ProductCustomizedProduct from "../../pages/client/productdetails/customizedproduct/ProductCustomizedProduct";
import { AiTwotoneHeart } from "react-icons/ai";
import {
  addToWhislist,
  removeToWhislist,
} from "../../redux/slices/wishlistSlice";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlistProducts,
  fetchWishlistForProductList,
} from "../../redux/slices/newWishlistSlice";

import { addToCart } from "../../redux/slices/newCartSlice.js";

import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import { BsFillCartFill } from "react-icons/bs";
import "./productcard.css";
import RaiseAQuery from "../../pages/client/RaiseAQuery/RaiseAQuery.jsx";
import { CustomizedFinialAmount } from "../../utils/usefullFunction.js";
import { roundNumber } from "../../utils/useFullFunctions/roundNumber.js";
import SnackbarMessage from "../../utils/snakbar/SnackbarMessage";

import { Slide, Fade } from "@mui/material";

function SlideTransition(props) {
  return (
    <Slide {...props} direction="up" vertical="bottom" horizontal="center" />
  );
}

const getUOM = (arr) =>
  arr.find((ele) => ele?.UOMId?.name !== "Pice" && ele?.UOMId?.name);

const CustomizeProductCard = ({
  product,
  collectionUrl,
  productCombination,
  collectionname,
  calculateCustomizedPrice,
  combination,
  wishlistData = [],
  cartData = [],
  isProductInWishlist = () => {},
  isWishlist = false,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userdetails } = useSelector((state) => state.auth);
  const { whishlistdata } = useSelector((state) => state.whishlist);
  const { wishlistProduct: addedWishlistProduct } = useSelector(
    (state) => state.wishlist
  );
  const newCollectionUrl = collectionUrl ?? collectionname;

  const { cartdata } = useSelector((state) => state.cart);
  const { addedCartProduct } = useSelector((state) => state.newCartSlice);
  // const [managecart, setmanagecart] = useState(false)
  const [ShowRaiseAQueryModal, setShowRaiseAQueryModal] = useState(false);
  const [wishlistProduct, setWishListProduct] = useState(null);
  const [wishlistProductIds, setWishListProductIds] = useState([]);
  const [backSelected, setBackSelected] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartProduct, setCartProduct] = useState(null);
  const [cartProductIds, setCartProductIds] = useState([]);
  const [state, setState] = React.useState({
    open: false,
    Transition: Fade,
    type: "",
    message: "",
  });

  useEffect(() => {
    if (combination) {
      // for front

      const FrontPrice = calculateCustomizedPrice(
        combination?.productId,
        combination?.Front,
        "FixedPrice"
      );

      let BackPrice = 0;

      // for back

      if (combination?.SAF?.length > 0) {
        BackPrice = calculateCustomizedPrice(
          combination?.productId,
          combination?.SAF,
          "FixedPriceSAF"
        );
        setBackSelected("SAF");
      } else if (combination?.CB?.length > 0) {
        BackPrice = calculateCustomizedPrice(
          combination?.productId,
          combination?.CB,
          "FixedPriceCB"
        );
        setBackSelected("CB");
      } else if (combination?.IB?.length > 0) {
        BackPrice = calculateCustomizedPrice(
          combination?.productId,
          combination?.IB,
          "FixedPriceIB"
        );
        setBackSelected("IB");
      }

      const total = FrontPrice + BackPrice;
      setTotalPrice(total);
    }
  }, [combination, calculateCustomizedPrice]);

  useEffect(() => {
    if (wishlistData) {
      setWishListProductIds(wishlistData);
    }
  }, [wishlistData]);

  useEffect(() => {
    if (addedWishlistProduct) {
      setWishListProductIds((prevState) => [
        ...prevState,
        addedWishlistProduct,
      ]);
    }
  }, [addedWishlistProduct]);

  // For Cart
  useEffect(() => {
    if (cartData && userdetails && Object.keys(userdetails)?.length > 0) {
      // console.log("cartData", cartData);
      setCartProductIds(cartData);
    } else if (
      cartdata &&
      userdetails &&
      Object.keys(userdetails)?.length === 0
    ) {
      const updatedCart = [...cartdata];

      const filteredData = updatedCart.filter(
        (product) => product?.customizedProductId
      );
      setCartProductIds(filteredData);
    }
  }, [cartData, userdetails, cartdata]);

  useEffect(() => {
    if (addedCartProduct) {
      setCartProductIds((prevState) => [...prevState, addedCartProduct]);
    }
  }, [addedCartProduct]);

  const handleAddTocart = async (product, combinations) => {
    try {
      let Front = [];
      let SAF = [];
      let IB = [];
      let CB = [];

      const copyAttributes = (data) => ({
        attributeId: data?.attributeId,
        isShow: data?.isShow,
        parameterId: data?.parameterId?._id,
        positionId: data?.positionId,
        positionX: data?.positionX,
        positionY: data?.positionY,
      });

      if (combinations) {
        Front = combinations.Front?.map(copyAttributes) || [];
        SAF = combinations.SAF?.map(copyAttributes) || [];
        IB = combinations.IB?.map(copyAttributes) || [];
        CB = combinations.CB?.map(copyAttributes) || [];
      }

      const productData = {
        customizedProductId: product?._id,
        Front,
        SAF,
        IB,
        CB,
        customizedProductBackSelected: backSelected,
        // customizedProductBackSelected: "",
        customizeProductWidth: product?.DefaultWidth,
        customizeProductHeight: product?.DefaultHeight,
      };

      if (userdetails && Object.keys(userdetails)?.length > 0) {
        await dispatch(addToCart(productData)).unwrap();
        // await dispatch(fetchWishlistForProductList()).unwrap();
      } else {
        dispatch(addTocart({ _id: Date.now(), quantity: 1, ...productData })); // saving in local storage
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

  const handleAddToWishlist = async (product, combinations) => {
    try {
      let Front = [];
      let SAF = [];
      let IB = [];
      let CB = [];

      const copyAttributes = (data) => ({
        attributeId: data?.attributeId,
        isShow: data?.isShow,
        parameterId: data?.parameterId?._id,
        positionId: data?.positionId,
        positionX: data?.positionX,
        positionY: data?.positionY,
      });

      if (combinations) {
        Front = combinations.Front?.map(copyAttributes) || [];
        SAF = combinations.SAF?.map(copyAttributes) || [];
        IB = combinations.IB?.map(copyAttributes) || [];
        CB = combinations.CB?.map(copyAttributes) || [];
      }

      const productData = {
        customizedProductId: product?._id,
        Front,
        SAF,
        IB,
        CB,
        customizedProductBackSelected: backSelected,
        // customizedProductBackSelected: "",
        customizeProductWidth: product?.DefaultWidth,
        customizeProductHeight: product?.DefaultHeight,
      };

      if (userdetails && Object.keys(userdetails)?.length > 0) {
        await dispatch(addToWishlist(productData)).unwrap();
        await dispatch(fetchWishlistForProductList()).unwrap();
      } else {
        dispatch(addToWhislist({ _id: Date.now(), ...productData })); // saving in local storage
      }
      setState({
        open: true,
        Transition: SlideTransition,
        type: "success",
        message: "Added To Wishlist!",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveToWishlist = async (id) => {
    try {
      if (Object.keys(userdetails)?.length > 0) {
        await dispatch(removeFromWishlist(id)).unwrap();
        await dispatch(fetchWishlistForProductList()).unwrap();
      } else {
        dispatch(removeToWhislist(id)); // remove from local storage
      }

      if (isWishlist && Object.keys(userdetails)?.length > 0) {
        dispatch(
          fetchWishlistProducts({ product: [], userId: userdetails?._id })
        );
        // } else if (isWishlist && Object.keys(userdetails)?.length === 0) {
        //   dispatch(
        //     fetchWishlistProducts({
        //       product: whishlistdata,
        //       userId: "unauthenticated",
        //     })
        //   );
      }
      setState({
        open: true,
        Transition: SlideTransition,
        type: "error",
        message: "Removed From Wishlist!",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleClicked = () => {
    setShowRaiseAQueryModal(true);
  };

  const RaiseModalClose = () => {
    setShowRaiseAQueryModal(false);
  };

  // for wishlist
  useEffect(() => {
    if (
      wishlistProductIds?.length > 0 &&
      combination &&
      userdetails &&
      Object.keys(userdetails).length > 0
    ) {
      const data = isProductInWishlist(combination, wishlistProductIds);

      setWishListProduct(data);
    } else if (
      whishlistdata?.length > 0 &&
      combination &&
      userdetails &&
      Object.keys(userdetails).length === 0
    ) {
      const data = isProductInWishlist(combination, wishlistProductIds);
      setWishListProduct(data);
    } else {
      setWishListProduct(null);
    }
  }, [
    wishlistProductIds,
    combination,
    isProductInWishlist,
    userdetails,
    whishlistdata,
  ]);

  useEffect(() => {
    if (cartProductIds?.length > 0 && combination) {
      const data = isProductInWishlist(combination, cartProductIds);

      setCartProduct(data);
    }

    // else if (
    //   cartdata?.length > 0 &&
    //   combination &&
    //   Object.keys(userdetails).length === 0
    // ) {
    //   const data = isProductInWishlist(combination, cartdata);
    //   setCartProduct(data);
    // }
    else {
      setCartProduct(null);
    }
  }, [cartProductIds, combination, isProductInWishlist, userdetails, cartdata]);

  return (
    <>
      <SnackbarMessage setState={setState} state={state} />

      <RaiseAQuery
        showRaiseAQueryModal={ShowRaiseAQueryModal}
        RaiseModalClose={RaiseModalClose}
        product={product}
        productCombination={(function () {
          let Front = [];
          let SAF = [];
          let IB = [];
          let CB = [];

          const copyAttributes = (data) => ({
            attributeId: data?.attributeId,
            isShow: data?.isShow,
            parameterId: data?.parameterId?._id,
            positionId: data?.positionId,
            positionX: data?.positionX,
            positionY: data?.positionY,
          });

          if (combination) {
            Front = combination.Front?.map(copyAttributes) || [];
            SAF = combination.SAF?.map(copyAttributes) || [];
            IB = combination.IB?.map(copyAttributes) || [];
            CB = combination.CB?.map(copyAttributes) || [];
          }

          return {
            customizedProductId: product?._id,
            Front,
            SAF,
            IB,
            CB,
            customizedProductBackSelected: backSelected,
            customizeProductWidth: product?.DefaultWidth,
            customizeProductHeight: product?.DefaultHeight,
          };
        })()}
      />

      <div className={`col-lg-4 homeproductcardstyle`}>
        <div className="ProductCardHover">
          <center>
            <div className="containers" style={{ position: "relative" }}>
              {wishlistProduct ? (
                <IconButton
                  color="primary"
                  aria-label="dislike"
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 2,
                  }}
                  onClick={() => handleRemoveToWishlist(wishlistProduct?._id)}
                >
                  <FavoriteIcon
                    size={22}
                    style={{
                      color: "red",
                    }}
                  />
                </IconButton>
              ) : (
                <IconButton
                  color="primary"
                  aria-label="dislike"
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 2,
                  }}
                  onClick={() => handleAddToWishlist(product, combination)}
                >
                  <AiTwotoneHeart size={22} />
                </IconButton>
              )}
              <Link
                to={`/customized-product/${
                  newCollectionUrl
                    ? newCollectionUrl
                    : product?.Collection[0]?.url
                }/${product?.Urlhandle}`}
              >
                <img
                  src={`${REACT_APP_URL}/images/product/${productCombination?.ProductImage[0]}`}
                  alt="img25"
                  className="img-fluid homeproductcardimage"
                />
              </Link>

              {userdetails &&
              userdetails.userRole?.find(
                (role) => role?.name === "Architect"
              ) ? (
                <div
                  className="overlays d-flex justify-content-between  align-items-center"
                  style={{
                    cursor: "pointer",
                    height: "50px",
                  }}
                  onClick={() => {
                    if (!cartProduct) {
                      handleAddTocart(product, combination);
                    } else {
                      navigate("/cart");
                    }
                  }}
                >
                  <h2
                    style={{
                      fontSize: 18,
                      color: "#fff",
                      letterSpacing: "1px",
                      paddingTop: "10px",
                    }}
                  >
                    {cartProduct ? "Go To Cart" : "Add To Cart"}
                  </h2>
                  <BsFillCartFill style={{ fontSize: "18", color: "#fff" }} />
                </div>
              ) : (
                !product?.RequestForPrice && (
                  <div
                    className="overlays d-flex justify-content-between  align-items-center"
                    style={{
                      cursor: "pointer",
                      height: "50px",
                    }}
                    onClick={() => {
                      if (!cartProduct) {
                        handleAddTocart(product, combination);
                      } else {
                        navigate("/cart");
                      }
                    }}
                  >
                    <h2
                      style={{
                        fontSize: 18,
                        color: "#fff",
                        letterSpacing: "1px",
                        paddingTop: "10px",
                      }}
                    >
                      {cartProduct ? "Go To Cart" : "Add To Cart"}
                    </h2>
                    <BsFillCartFill style={{ fontSize: "18", color: "#fff" }} />
                  </div>
                )
              )}
            </div>
          </center>

          <div style={{ padding: "10px" }}>
            <Link
              to={`/customized-product/${
                newCollectionUrl
                  ? newCollectionUrl
                  : product?.Collection[0]?.url
              }/${product?.Urlhandle}`}
              style={{ textDecoration: "none" }}
            >
              <h6
                style={{
                  textDecoration: "none",
                  color: "#463D36",
                  textAlign: "center",
                  fontSize: "16px",
                  textTransform: "uppercase",
                  fontWeight: "600",
                }}
              >
                {productCombination?.ProductName}
              </h6>
            </Link>

            <div className="justify-content-between mb-2">
              {userdetails &&
              userdetails.userRole?.find(
                (role) => role?.name === "Architect"
              ) ? (
                <center>
                  <h2
                    style={{
                      fontSize: 16,
                      color: "#463D36",
                      fontWeight: "600",
                    }}
                  >
                    {`Rs ${roundNumber(
                      Number(
                        product?.DefaultWidth && product?.DefaultHeight
                          ? CustomizedFinialAmount(totalPrice, product) /
                              (product?.DefaultWidth * product?.DefaultHeight)
                          : product?.DefaultWidth
                          ? CustomizedFinialAmount(totalPrice, product) /
                            product?.DefaultWidth
                          : product?.DefaultHeight
                          ? CustomizedFinialAmount(totalPrice, product) /
                            product?.DefaultHeight
                          : 0
                      )
                    )} / ${
                      getUOM(product?.attribute)?.UOMId?.name
                        ? getUOM(product?.attribute)?.UOMId?.name === "Length"
                          ? "Rft"
                          : getUOM(product?.attribute)?.UOMId?.name
                        : "Pice"
                    }`}
                    {/* {`Rs. ${CustomizedFinialAmount(
                  totalPrice,
                  product
                )} / ${
                  getUOM(product?.attribute)?.UOMId?.name
                    ? getUOM(product?.attribute)?.UOMId?.name ===
                      "Length"
                      ? "Rft"
                      : getUOM(product?.attribute)?.UOMId?.name
                    : "Pice"
                }`} */}
                    &nbsp;&nbsp;
                  </h2>
                </center>
              ) : product?.RequestForPrice ? (
                <center>
                  <button
                    className="badge btn-default Request-for-Price-btn p-2"
                    type="button"
                    onClick={() => handleClicked()}
                  >
                    Request for Price
                  </button>
                </center>
              ) : (
                <>
                  <div>
                    <center>
                      <h2
                        style={{
                          fontSize: 16,
                          color: "#463D36",
                          fontWeight: "600",
                        }}
                      >
                        {`Rs ${roundNumber(
                          Number(
                            product?.DefaultWidth && product?.DefaultHeight
                              ? CustomizedFinialAmount(totalPrice, product) /
                                  (product?.DefaultWidth *
                                    product?.DefaultHeight)
                              : product?.DefaultWidth
                              ? CustomizedFinialAmount(totalPrice, product) /
                                product?.DefaultWidth
                              : product?.DefaultHeight
                              ? CustomizedFinialAmount(totalPrice, product) /
                                product?.DefaultHeight
                              : 0
                          )
                        )} / ${
                          getUOM(product?.attribute)?.UOMId?.name
                            ? getUOM(product?.attribute)?.UOMId?.name ===
                              "Length"
                              ? "Rft"
                              : getUOM(product?.attribute)?.UOMId?.name
                            : "Pice"
                        }`}
                        {/* {`Rs. ${CustomizedFinialAmount(
                          totalPrice,
                          product
                        )} / ${
                          getUOM(product?.attribute)?.UOMId?.name
                            ? getUOM(product?.attribute)?.UOMId?.name ===
                              "Length"
                              ? "Rft"
                              : getUOM(product?.attribute)?.UOMId?.name
                            : "Pice"
                        }`} */}
                        &nbsp;&nbsp;
                      </h2>
                    </center>
                  </div>
                  {/* <AiTwotoneHeart
                    size={22}
                    // color="#463D36"
                    onClick={() => handlAddToWhislist(product?._id)}
                  /> */}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomizeProductCard;
