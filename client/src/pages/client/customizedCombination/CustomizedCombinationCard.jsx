import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomizedCombinationImage from "./CustomizedCombinationImage";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../../redux/slices/cartSlice";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { AiTwotoneHeart } from "react-icons/ai";
import "./CustomizedCombinationCard.css";
import {
  addToWhislist,
  removeToWhislist,
} from "../../../redux/slices/wishlistSlice";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlistForProductList,
  fetchWishlistCustomizedComboProducts,
} from "../../../redux/slices/newWishlistSlice";

import {
  getCartCustomizeComboProduct,
  addToCart,
} from "../../../redux/slices/newCartSlice";

import { REACT_APP_URL } from "../../../config";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import SnackbarMessage from "../../../utils/snakbar/SnackbarMessage";
import { isCustomizedComboProductInWishlist } from "../../../utils/isInWishlist/isCustomizeComboProduct";

import { Slide, Fade } from "@mui/material";

function SlideTransition(props) {
  return (
    <Slide {...props} direction="up" vertical="bottom" horizontal="center" />
  );
}

const CustomizeCombinationCard = ({
  product,
  selectedCustomizedProduct,
  setComboRectangle = () => {},
  comboRectangle = {},
  id,
  setTotalPrice = () => {},
  wishlistData = [],
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    addedCartProduct,
    cartCustomizeComboProduct,
    cartCustomizeComboProductLoading,
  } = useSelector((state) => state.newCartSlice);

  const { cartdata } = useSelector((state) => state.cart);

  // const [totalPrice, setTotalPrice] = useState([]);
  const { whishlistdata } = useSelector((state) => state.whishlist);
  const [childComponentPrice, setchildComponentPrice] = useState([]);
  const [customizedCombination, setCustomizedCombination] = useState([]);
  const { userdetails } = useSelector((state) => state.auth);
  const [wishlistProduct, setWishListProduct] = useState(null);
  const [wishlistProductIds, setWishListProductIds] = useState([]);
  const [cartProduct, setCartProduct] = useState(null);
  const [cartProductIds, setCartProductIds] = useState([]);

  const [state, setState] = React.useState({
    open: false,
    Transition: Fade,
    type: "",
    message: "",
  });

  const updateTotalPrice = useCallback((index, price) => {
    setchildComponentPrice((prevPrices) => {
      const newPrices = [...prevPrices];
      newPrices[index] = price;
      return newPrices;
    });
  }, []);

  useEffect(() => {
    if (wishlistData) {
      setWishListProductIds(wishlistData);
    }
  }, [wishlistData]);

  useEffect(() => {
    if (addedCartProduct) {
      setCartProductIds((prevState) => [...prevState, addedCartProduct]);
    }
  }, [addedCartProduct]);

  useEffect(() => {
    if (userdetails && Object.keys(userdetails).length > 0) {
      dispatch(getCartCustomizeComboProduct({ id: userdetails?._id }));
    }
  }, [dispatch, userdetails]);

  useEffect(() => {
    if (
      cartCustomizeComboProductLoading === "fulfilled" &&
      cartCustomizeComboProduct
    ) {
      setCartProductIds(cartCustomizeComboProduct);
    }
  }, [cartCustomizeComboProduct, cartCustomizeComboProductLoading]);

  const handleAddToWishlist = async (customizedCombinations) => {
    try {
      const copyAttributes = (data) => ({
        attributeId: data?.attributeId?._id,
        isShow: data?.isShow,
        parameterId: data?.parameterId,
        positionId: data?.positionId,
        positionX: data?.positionX,
        positionY: data?.positionY,
      });

      const rectangleData = customizedCombinations.map((combination) => {
        return {
          ...combination,
          Front: combination?.Front?.map(copyAttributes),
          SAF: combination?.SAF?.map(copyAttributes),
          IB: combination?.IB?.map(copyAttributes),
          CB: combination?.CB?.map(copyAttributes),
        };
      });

      const productData = {
        customizedComboId: id,
        customizedComboRectangle: rectangleData,
      };

      if (Object.keys(userdetails)?.length > 0) {
        await dispatch(addToWishlist(productData)).unwrap();
        await dispatch(fetchWishlistForProductList()).unwrap();
        await dispatch(
          fetchWishlistCustomizedComboProducts({ userId: userdetails?._id })
        ).unwrap();
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
        await dispatch(
          fetchWishlistCustomizedComboProducts({ userId: userdetails?._id })
        ).unwrap();
      } else {
        dispatch(removeToWhislist(id)); // remove from local storage
      }

      // if (isWishlist && Object.keys(userdetails)?.length > 0) {
      //   dispatch(
      //     fetchWishlistProducts({ product: [], userId: userdetails?._id })
      //   );
      // }
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

  const handleAddTocart = async (customizedCombinations) => {
    try {
      const copyAttributes = (data) => ({
        attributeId: data?.attributeId?._id,
        isShow: data?.isShow,
        parameterId: data?.parameterId,
        positionId: data?.positionId,
        positionX: data?.positionX,
        positionY: data?.positionY,
      });

      const rectangleData = customizedCombinations.map((combination) => {
        return {
          ...combination,
          Front: combination?.Front?.map(copyAttributes),
          SAF: combination?.SAF?.map(copyAttributes),
          IB: combination?.IB?.map(copyAttributes),
          CB: combination?.CB?.map(copyAttributes),
        };
      });

      const productData = {
        customizedComboId: id,
        customizedComboRectangle: rectangleData,
      };

      if (Object.keys(userdetails)?.length > 0) {
        await dispatch(addToCart(productData)).unwrap();
        // await dispatch(fetchWishlistForProductList()).unwrap();
        // await dispatch(
        //   fetchWishlistCustomizedComboProducts({ userId: userdetails?._id })
        // ).unwrap();
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

  const totalPrice = childComponentPrice.reduce((acc, ele) => {
    return Number(acc) + Number(ele?.price);
  }, 0);

  useEffect(() => {
    setTotalPrice(totalPrice);
  }, [totalPrice, setTotalPrice]);

  // for wishlist
  useEffect(() => {
    if (
      wishlistProductIds?.length > 0 &&
      customizedCombination &&
      customizedCombination?.length > 0 &&
      userdetails &&
      Object.keys(userdetails).length > 0
    ) {
      const data = isCustomizedComboProductInWishlist(
        customizedCombination,
        wishlistProductIds
      );
      setWishListProduct(data);
    } else if (
      whishlistdata?.length > 0 &&
      customizedCombination &&
      customizedCombination?.length > 0 &&
      Object.keys(userdetails).length === 0
    ) {
      const data = isCustomizedComboProductInWishlist(
        customizedCombination,
        wishlistProductIds
      );

      setWishListProduct(data);
    } else {
      setWishListProduct(null);
    }
  }, [wishlistProductIds, customizedCombination, userdetails, whishlistdata]);

  //  for cart
  useEffect(() => {
    if (
      cartProductIds?.length > 0 &&
      customizedCombination &&
      customizedCombination?.length > 0 &&
      userdetails &&
      Object.keys(userdetails).length > 0
    ) {
      const data = isCustomizedComboProductInWishlist(
        customizedCombination,
        cartProductIds
      );
      setCartProduct(data);
    } else if (
      cartdata?.length > 0 &&
      customizedCombination &&
      customizedCombination?.length > 0 &&
      Object.keys(userdetails).length === 0
    ) {
      const data = isCustomizedComboProductInWishlist(
        customizedCombination,
        cartdata
      );
      setCartProduct(data);
    } else {
      setCartProduct(null);
    }
  }, [cartProductIds, customizedCombination, userdetails, cartdata]);

  return (
    <>
      <SnackbarMessage setState={setState} state={state} />

      <div
        className={`col-lg-4 customizedelevationcardstyle`}
      >
        <div className="ProductCardHoverCustomizedelevation">
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
                    zIndex: 10,
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
                    zIndex: 10,
                  }}
                  onClick={() => handleAddToWishlist(customizedCombination)}
                >
                  <AiTwotoneHeart size={22} />
                </IconButton>
              )}

              <img
                loading="lazy"
                src={`${REACT_APP_URL}/images/product/${product?.customizedComboId?.image}`}
                alt="Image_From_Server"
                className="img-fluid customizedelevationcardImagestyle"
                // style={{ maxHeight: isShownBottomData ? "" : "78vh" }}
                // onClick={handleClick}
              />

              {selectedCustomizedProduct?.length > 0 &&
                selectedCustomizedProduct?.map((p, i) => {
                  return (
                    <div key={i}>
                      <CustomizedCombinationImage
                        id={p?._id}
                        productId={product?._id}
                        index={i}
                        customuizedProduct={p?.customizedProductDetails}
                        comboRectangle={comboRectangle}
                        setComboRectangle={setComboRectangle}
                        key={p?._id}
                        PositionX={p?.top}
                        PositionY={p?.left}
                        Height={p?.height}
                        Width={p?.width}
                        updateTotalPrice={updateTotalPrice}
                        setCustomizedCombination={setCustomizedCombination}
                      />
                    </div>
                  );
                })}

              <div
                className="overlays d-flex justify-content-between  align-items-center"
                style={{
                  cursor: "pointer",
                  height: "50px",
                  zIndex: "10",
                }}
                onClick={() => {
                  if (!cartProduct) {
                    handleAddTocart(customizedCombination);
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
                <AiOutlineShoppingCart
                  style={{ fontSize: "18", color: "#fff" }}
                />
              </div>
            </div>
          </center>
          <Link
            to={`/customized-combination/${product?.customizedComboId?._id}`}
            style={{
              textDecoration: "none",
            }}
          >
            <div style={{ padding: "10px" }}>
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
                {product?.customizedComboId?.Name}
              </h6>

              <div className="justify-content-between mb-2">
                <>
                  <center>
                    <h2
                      style={{
                        fontSize: 16,
                        color: "#463D36",
                        fontWeight: "600",
                      }}
                    >
                      ₹ {totalPrice}
                    </h2>
                  </center>
                </>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CustomizeCombinationCard;