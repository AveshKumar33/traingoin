import React, { useState, useEffect } from "react";
// import busimg from "../../assets/Image/si1.png";
// import productimg from "../../assets/Image/Twin-Sleeper-Sofa.jpg";
import { REACT_APP_URL } from "../../config";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/slices/cartSlice";
import { addToCart } from "../../redux/slices/newCartSlice.js";
// import CartSidebar from "../cartSidebar/CartSidebar";
// import { toast } from "react-toastify";
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
  fetchWishlistSingleProducts,
} from "../../redux/slices/newWishlistSlice";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import { BsFillCartFill } from "react-icons/bs";
import "./productcard.css";
import RaiseAQuery from "../../pages/client/RaiseAQuery/RaiseAQuery.jsx";
import { FinialAmount } from "../../utils/usefullFunction.js";
import SnackbarMessage from "../../utils/snakbar/SnackbarMessage";
// import { RotatingLines } from "react-loader-spinner";

import { Slide, Fade } from "@mui/material";

function SlideTransition(props) {
  return (
    <Slide {...props} direction="up" vertical="bottom" horizontal="center" />
  );
}

const ProductCard = ({
  product,
  collectionname = "",
  collectionUrl,
  productCombination,
  wishlistData = [],
  isProductInWishlist = () => {},
  isWishlist = false,
  isArchitect = false,
  architectId = "",
  cartData = [],
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userdetails } = useSelector((state) => state.auth);
  const { wishlistProduct: addedWishlistProduct } = useSelector(
    (state) => state.wishlist
  );

  const { addedCartProduct } = useSelector((state) => state.newCartSlice);

  const { cartdata } = useSelector((state) => state.cart);
  const { whishlistdata } = useSelector((state) => state.whishlist);
  const newCollectionUrl = collectionUrl ?? collectionname;

  const [wishlistProduct, setWishListProduct] = useState(null);
  const [wishlistProductIds, setWishListProductIds] = useState([]);

  const [cartProduct, setCartProduct] = useState(null);
  const [cartProductIds, setCartProductIds] = useState([]);

  const [ShowRaiseAQueryModal, setShowRaiseAQueryModal] = useState(false);

  const [state, setState] = React.useState({
    open: false,
    Transition: Fade,
    type: "",
    message: "",
  });

  // For Wishlist
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
    if (cartData) {
      setCartProductIds(cartData);
    }
  }, [cartData]);

  useEffect(() => {
    if (addedCartProduct) {
      setCartProductIds((prevState) => [...prevState, addedCartProduct]);
    }
  }, [addedCartProduct]);

  const handleAddTocart = async (product) => {
    try {
      const productData = {
        singleProductId: product?.singleProductId?._id,
        singleProductCombinations: product?.combinations,
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

  const handleAddToWishlist = async (product) => {
    try {
      const productData = {
        singleProductId: product?.singleProductId?._id,
        singleProductCombinations: product?.combinations,
      };
      if (userdetails && Object.keys(userdetails)?.length > 0) {
        await dispatch(addToWishlist(productData)).unwrap();
        await dispatch(fetchWishlistForProductList()).unwrap();
      } else {
        dispatch(addToWhislist({ _id: Date.now(), ...productData })); // saving in local storage
      }

      if (isArchitect && userdetails && Object.keys(userdetails)?.length > 0) {
        await dispatch(
          fetchWishlistSingleProducts({
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
        setWishListProduct(null);
      } else {
        dispatch(removeToWhislist(id)); // remove from local storage
      }

      // if (isArchitect && userdetails && Object.keys(userdetails)?.length > 0) {
      //   dispatch(
      //     fetchWishlistSingleProducts({
      //       userId: userdetails?._id,
      //     })
      //   );
      // }

      if (isWishlist && userdetails && Object.keys(userdetails)?.length > 0) {
        dispatch(
          fetchWishlistProducts({ product: [], userId: userdetails?._id })
        );
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

  const images =
    productCombination?.image !== "default.png"
      ? productCombination?.singleProductId?.ProductImage[0]
      : productCombination?.singleProductId?.ProductImage[0];
  // for wishlist
  useEffect(() => {
    if (
      wishlistProductIds?.length > 0 &&
      Object.keys(productCombination)?.length > 0 &&
      productCombination?.combinations?.length > 0 &&
      Object.keys(userdetails).length > 0
    ) {
      const productData = {
        singleProductId: productCombination?.singleProductId?._id,
        singleProductCombinations: productCombination?.combinations,
      };

      const data = isProductInWishlist(wishlistProductIds, productData);
      setWishListProduct(data);
    } else if (
      whishlistdata?.length > 0 &&
      Object.keys(productCombination)?.length > 0 &&
      productCombination?.combinations?.length > 0 &&
      Object.keys(userdetails).length === 0
    ) {
      const productData = {
        singleProductId: productCombination?.singleProductId?._id,
        singleProductCombinations: productCombination?.combinations,
      };

      const data = isProductInWishlist(whishlistdata, productData);
      setWishListProduct(data);
    } else {
      setWishListProduct(null);
    }
  }, [
    wishlistProductIds,
    productCombination,
    isProductInWishlist,
    userdetails,
    whishlistdata,
  ]);

  // for cart
  useEffect(() => {
    if (
      cartProductIds?.length > 0 &&
      Object.keys(productCombination)?.length > 0 &&
      productCombination?.combinations?.length > 0 &&
      Object.keys(userdetails).length > 0
    ) {
      const productData = {
        singleProductId: productCombination?.singleProductId?._id,
        singleProductCombinations: productCombination?.combinations,
      };

      const data = isProductInWishlist(cartProductIds, productData);
      setCartProduct(data);
    } else if (
      cartdata?.length > 0 &&
      Object.keys(productCombination)?.length > 0 &&
      productCombination?.combinations?.length > 0 &&
      Object.keys(userdetails).length === 0
    ) {
      const productData = {
        singleProductId: productCombination?.singleProductId?._id,
        singleProductCombinations: productCombination?.combinations,
      };

      const data = isProductInWishlist(cartdata, productData);

      setCartProduct(data);
    } else {
      setCartProduct(null);
    }
  }, [
    cartProductIds,
    productCombination,
    isProductInWishlist,
    userdetails,
    cartdata,
  ]);

  return (
    <>
      <SnackbarMessage setState={setState} state={state} />

      <RaiseAQuery
        showRaiseAQueryModal={ShowRaiseAQueryModal}
        RaiseModalClose={RaiseModalClose}
        product={product}
        architectId={architectId}
        productCombination={{
          singleProductId: productCombination?.singleProductId?._id,
          singleProductCombinations: productCombination?.combinations,
        }}
      />

      <div className={`col-lg-4 homeproductcardstyle`}>
        <div className="ProductCardHover">
          <center>
            <div className="containers">
              {/* {wishlistProductIdsSet &&
              wishlistProductIdsSet.has(product?._id) ? ( */}
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
                  onClick={() => handleAddToWishlist(productCombination)}
                >
                  <AiTwotoneHeart size={22} />
                </IconButton>
              )}
              <Link
                target={isArchitect ? "_blank" : "_self"}
                to={
                  isArchitect
                    ? `/product/${
                        newCollectionUrl
                          ? newCollectionUrl
                          : product?.Collection[0]?.url
                      }/${product.Urlhandle}?isWishlist=${
                        productCombination?._id
                      }&isArchitect=${architectId}`
                    : isWishlist
                    ? `/product/${
                        newCollectionUrl
                          ? newCollectionUrl
                          : product?.Collection[0]?.url
                      }/${product.Urlhandle}?isWishlist=${wishlistProduct?._id}`
                    : `/product/${
                        newCollectionUrl
                          ? newCollectionUrl
                          : product?.Collection[0]?.url
                      }/${product.Urlhandle}`
                }
              >
                <img
                  src={`${REACT_APP_URL}/images/product/${images}`}
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
                      handleAddTocart(productCombination);
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
                        handleAddTocart(productCombination);
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
              to={`/product/${
                newCollectionUrl
                  ? newCollectionUrl
                  : product?.Collection[0]?.url
              }/${product.Urlhandle}`}
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
                {productCombination?.singleProductId?.ProductName}
              </h6>
            </Link>

            <div className="justify-content-between mb-2">
              {userdetails &&
              userdetails.userRole?.find(
                (role) => role?.name === "Architect"
              ) ? (
                // Show price regardless of RequestForPrice
                <center>
                  <h2
                    style={{
                      fontSize: "15px",
                      color: "#463D36",
                      fontWeight: "600",
                    }}
                  >
                    ₹ {FinialAmount(productCombination?.SalePrice, product)}
                    &nbsp; &nbsp; &nbsp;
                    <strike>
                      ₹{FinialAmount(productCombination?.MRP, product)}
                    </strike>
                    &nbsp; &nbsp;
                    {/* <AiTwotoneHeart
        size={22}
        color="#463D36"
        onClick={() => handlAddToWhislist(product?._id)}
      /> */}
                  </h2>
                </center>
              ) : product?.RequestForPrice ? (
                // Show Request for Price button if RequestForPrice is true
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
                // Show price if RequestForPrice is false
                <center>
                  <h2
                    style={{
                      fontSize: "15px",
                      color: "#463D36",
                      fontWeight: "600",
                    }}
                  >
                    ₹ {FinialAmount(productCombination?.SalePrice, product)}
                    &nbsp; &nbsp; &nbsp;
                    <strike>
                      ₹{FinialAmount(productCombination?.MRP, product)}
                    </strike>
                    &nbsp; &nbsp;
                  </h2>
                </center>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
