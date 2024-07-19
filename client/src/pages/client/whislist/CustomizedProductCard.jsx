import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { REACT_APP_URL } from "../../../config.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../../redux/slices/cartSlice.js";
// import CartSidebar from "../cartSidebar/CartSidebar";
// import { toast } from "react-toastify";
// import ProductCustomizedProduct from "../../pages/client/productdetails/customizedproduct/ProductCustomizedProduct";
import { AiTwotoneHeart } from "react-icons/ai";
import {
  addToWhislist,
  removeToWhislist,
} from "../../../redux/slices/wishlistSlice";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlistCustomizedProducts,
  fetchWishlistForProductList,
  fetchCustomizedProductsWishlist,
} from "../../../redux/slices/newWishlistSlice";

import { addToCart } from "../../../redux/slices/newCartSlice";

import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import { BsFillCartFill } from "react-icons/bs";
import "./productCard.css";
import RaiseAQuery from "../../../pages/client/RaiseAQuery/RaiseAQuery.jsx";
import { CustomizedFinialAmount } from "../../../utils/usefullFunction.js";
import { roundNumber } from "../../../utils/useFullFunctions/roundNumber.js";
import SnackbarMessage from "../../../utils/snakbar/SnackbarMessage.jsx";

import { Slide, Fade } from "@mui/material";

function SlideTransition(props) {
  return (
    <Slide {...props} direction="up" vertical="bottom" horizontal="center" />
  );
}

const getUOM = (arr) => {
  if (!arr) {
    return;
  }
  return arr.find((ele) => ele?.UOMId?.name !== "Pice" && ele?.UOMId?.name);
};

const CustomizeProductCard = ({
  product,
  collectionUrl,
  productCombination,
  collectionname,
  calculateCustomizedPrice,
  combination,
  wishlistData = {},
  isProductInWishlist = () => {},
  isWishlist = false,
  isArchitect = false,
  cartData = [],
  architectId = "",
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userdetails } = useSelector((state) => state.auth);
  // const { whishlistdata } = useSelector((state) => state.whishlist);
  const { wishlistProduct: addedWishlistProduct } = useSelector(
    (state) => state.wishlist
  );
  const { addedCartProduct } = useSelector((state) => state.newCartSlice);
  const newCollectionUrl = collectionUrl ?? collectionname;

  const { cartdata } = useSelector((state) => state.cart);
  // const [managecart, setmanagecart] = useState(false)
  const [backSelected, setBackSelected] = useState("");
  const [ShowRaiseAQueryModal, setShowRaiseAQueryModal] = useState(false);
  const [wishlistProduct, setWishListProduct] = useState(null);
  const [wishlistProductIds, setWishListProductId] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartProduct, setCartProduct] = useState(null);
  const [cartProductIds, setCartProductIds] = useState([]);

  const { whishlistdata } = useSelector((state) => state.whishlist);
  const [state, setState] = React.useState({
    open: false,
    Transition: Fade,
    type: "",
    message: "",
  });

  useEffect(() => {
    if (combination) {
      const product = combination?.customizeProduct;
      // for front
      const FrontPrice = calculateCustomizedPrice(
        product,
        combination?.FrontCombinations,
        "FixedPrice",
        {
          width: combination?.customizeProductWidth,
          height: combination?.customizeProductHeight,
        }
      );

      let BackPrice = 0;
      // for back
      if (
        combination?.SAF?.length > 0 &&
        combination?.customizedProductBackSelected === "SAF"
      ) {
        BackPrice = calculateCustomizedPrice(
          product,
          combination?.SAFCombinations,
          "FixedPriceSAF",
          {
            width: combination?.customizeProductWidth,
            height: combination?.customizeProductHeight,
          }
        );
        setBackSelected("SAF");
      } else if (
        combination?.CB?.length > 0 &&
        combination?.customizedProductBackSelected === "CB"
      ) {
        BackPrice = calculateCustomizedPrice(
          product,
          combination?.CBCombinations,
          "FixedPriceCB",
          {
            width: combination?.customizeProductWidth,
            height: combination?.customizeProductHeight,
          }
        );
        setBackSelected("CB");
      } else if (
        combination?.IB?.length > 0 &&
        combination?.customizedProductBackSelected === "IB"
      ) {
        BackPrice = calculateCustomizedPrice(
          product,
          combination?.IBCombinations,
          "FixedPriceIB",
          {
            width: combination?.customizeProductWidth,
            height: combination?.customizeProductHeight,
          }
        );
        setBackSelected("IB");
      }

      const total = FrontPrice + BackPrice;
      setTotalPrice(total);
    }
  }, [combination, calculateCustomizedPrice]);

  useEffect(() => {
    if (wishlistData && !isArchitect) {
      setWishListProduct(wishlistData);
    }
  }, [wishlistData, isArchitect]);

  useEffect(() => {
    if (wishlistData && isArchitect) {
      setWishListProductId(wishlistData);
    }
  }, [wishlistData, isArchitect]);

  useEffect(() => {
    if (addedWishlistProduct) {
      setWishListProductId((prevState) => [...prevState, addedWishlistProduct]);
    }
  }, [addedWishlistProduct]);

  // For Cart
  useEffect(() => {
    if (cartData && userdetails && Object.keys(userdetails)?.length > 0) {
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
        ...(isArchitect && { archId: isArchitect }),
        customizedProductId: product?._id,
        Front,
        SAF,
        IB,
        CB,
        customizedProductBackSelected: isArchitect
          ? combination?.customizedProductBackSelected
          : backSelected,
        customizeProductWidth: isArchitect
          ? combination?.customizeProductWidth
          : product?.DefaultWidth,
        customizeProductHeight: isArchitect
          ? combination?.customizeProductHeight
          : product?.DefaultHeight,
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
        customizedProductBackSelected: isArchitect
          ? combination?.customizedProductBackSelected
          : backSelected,
        customizeProductWidth: isArchitect
          ? combination?.customizeProductWidth
          : product?.DefaultWidth,
        customizeProductHeight: isArchitect
          ? combination?.customizeProductHeight
          : product?.DefaultHeight,
      };

      if (Object.keys(userdetails)?.length > 0) {
        await dispatch(addToWishlist(productData)).unwrap();
        await dispatch(fetchWishlistForProductList()).unwrap();
      } else {
        dispatch(addToWhislist({ _id: Date.now(), ...productData })); // saving in local storage
      }

      if (isArchitect && userdetails && Object.keys(userdetails)?.length > 0) {
        await dispatch(
          fetchCustomizedProductsWishlist({
            userId: userdetails?._id,
          })
        ).unwrap();
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

      if (isArchitect && userdetails && Object.keys(userdetails)?.length > 0) {
        await dispatch(
          fetchCustomizedProductsWishlist({
            userId: userdetails?._id,
          })
        ).unwrap();
      }

      if (isWishlist && Object.keys(userdetails)?.length > 0) {
        dispatch(
          fetchWishlistCustomizedProducts({
            product: [],
            userId: userdetails?._id,
          })
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
      isArchitect &&
      wishlistProductIds?.length > 0 &&
      combination &&
      userdetails &&
      Object.keys(userdetails).length > 0
    ) {
      const data = isProductInWishlist(combination, wishlistProductIds);
      setWishListProduct(data);
    } else if (
      isArchitect &&
      whishlistdata?.length > 0 &&
      combination &&
      Object.keys(userdetails).length === 0
    ) {
      const data = isProductInWishlist(combination, wishlistProductIds);
      setWishListProduct(data);
    } else if (isArchitect) {
      setWishListProduct(null);
    }
  }, [
    wishlistProductIds,
    combination,
    isProductInWishlist,
    userdetails,
    whishlistdata,
    isArchitect,
  ]);

  // for cart
  useEffect(() => {
    if (
      isArchitect &&
      cartProductIds?.length > 0 &&
      combination &&
      userdetails &&
      Object.keys(userdetails).length > 0
    ) {
      const data = isProductInWishlist(combination, cartProductIds);
      setCartProduct(data);
    } else if (
      cartProductIds?.length > 0 &&
      combination &&
      userdetails &&
      Object.keys(userdetails).length > 0
    ) {
      const data = isProductInWishlist(combination, cartProductIds);
      setCartProduct(data);
    } else if (
      isArchitect &&
      cartdata?.length > 0 &&
      combination &&
      Object.keys(userdetails).length === 0
    ) {
      const data = isProductInWishlist(combination, cartProductIds);
      setCartProduct(data);
    } else if (isArchitect) {
      setCartProduct(null);
    }
  }, [
    cartProductIds,
    combination,
    isProductInWishlist,
    userdetails,
    cartdata,
    isArchitect,
  ]);

  return (
    <>
      <SnackbarMessage setState={setState} state={state} />
      <RaiseAQuery
        showRaiseAQueryModal={ShowRaiseAQueryModal}
        RaiseModalClose={RaiseModalClose}
        product={product}
        architectId={architectId}
        productCombination={(function (combinations) {
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
            customizedProductBackSelected: isArchitect
              ? combination?.customizedProductBackSelected
              : backSelected,
            customizeProductWidth: isArchitect
              ? combination?.customizeProductWidth
              : product?.DefaultWidth,
            customizeProductHeight: isArchitect
              ? combination?.customizeProductHeight
              : product?.DefaultHeight,
          };
          return productData;
        })(combination)}
      />

      <div className={`col-lg-4 customizedwishlishtproductcard`}>
        <div className="ProductCardHover">
          <center>
            <div className="containers">
              {wishlistProduct ? (
                <IconButton
                  color="primary"
                  aria-label="dislike"
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 31,
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
                    zIndex: 31,
                  }}
                  onClick={() => handleAddToWishlist(product, combination)}
                >
                  <AiTwotoneHeart size={22} />
                </IconButton>
              )}
              <Link
                style={{ cursor: "pointer" }}
                to={
                  isArchitect
                    ? `/customized-product/${
                        newCollectionUrl
                          ? newCollectionUrl
                          : product?.Collection[0]?.url
                      }/${product?.Urlhandle}?isWishlist=${
                        combination?._id
                      }&isArchitect=${architectId}`
                    : `/customized-product/${
                        newCollectionUrl
                          ? newCollectionUrl
                          : product?.Collection[0]?.url
                      }/${product?.Urlhandle}?isWishlist=${
                        wishlistProduct?._id
                      }`
                }
                target="_blank"
              >
                {combination?.customizedProductBackSelected === "" ? (
                  <img
                    src={`${REACT_APP_URL}/images/product/${combination?.customizeProduct?.ProductImage[0]}`}
                    alt="img25"
                    className="img-fluid homeproductcardimage"
                  />
                ) : (
                  <ImageCreation
                    customuizedProductFront={combination?.FrontCombinations}
                  />
                )}
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

              {/* <div
                className="overlays d-flex justify-content-between  align-items-center"
                style={{
                  cursor: "pointer",
                  height: "50px",
                }}
                onClick={() => {
                  handleAddTocart(
                    productCombination?.ProductName,
                    productCombination?.SalePrice,
                    productCombination?._id,
                    productCombination?.ProductImage[0],
                    productCombination?.ProductInStockQuantity,
                    productCombination?.singleProductId?.GSTIN
                  );
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
                  Add To Cart
                </h2>
                <BsFillCartFill style={{ fontSize: "18", color: "#fff" }} />
              </div> */}
            </div>
          </center>

          <div style={{ padding: "10px" }}>
            <Link
              to={`/customized-product/${
                newCollectionUrl
                  ? newCollectionUrl
                  : product?.Collection[0]?.url
              }/${product?.Urlhandle}`}
              target="_blank"
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
              {product?.RequestForPrice ? (
                <>
                  <center>
                    <button
                      className="badge btn-default Request-for-Price-btn p-2"
                      type="button"
                      onClick={() => handleClicked()}
                    >
                      Request for Price
                    </button>
                    {/* <AiTwotoneHeart
                      size={22}
                      // color="#463D36"
                      onClick={() => handlAddToWhislist(product?._id)}
                    /> */}
                  </center>
                </>
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
                            combination?.customizeProductWidth &&
                              combination?.customizeProductHeight
                              ? CustomizedFinialAmount(totalPrice, product) /
                                  (combination?.customizeProductWidth *
                                    combination?.customizeProductHeight)
                              : combination?.customizeProductWidth
                              ? CustomizedFinialAmount(totalPrice, product) /
                                combination?.customizeProductWidth
                              : combination?.customizeProductHeight
                              ? CustomizedFinialAmount(totalPrice, product) /
                                combination?.customizeProductHeight
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

const ImageCreation = ({
  customuizedProductFront,
  // varientproductdetails,
}) => {
  return (
    <>
      <div
        style={{
          position: "relative", // Add position relative to contain absolute positioning of child images
          // height: "80vh",
        }}
      >
        {customuizedProductFront &&
          customuizedProductFront.length > 0 &&
          customuizedProductFront.map((img, i) => (
            <img
              key={i}
              src={`${REACT_APP_URL}/images/parameterPosition/${img?.pngImage}`}
              alt="Preview"
              style={{
                position: i === 0 ? "relative" : "absolute", // Position images absolutely within the parent div
                top: 0,
                left: 0,
                height: "100%",
                width: "100%",
                objectFit: "cover", // Ensure the image fills its container without distortion
                zIndex: img?.attributeId?.BurgerSque, // Use zIndex from the image attribute
              }}
            />
          ))}
      </div>
    </>
  );
};
