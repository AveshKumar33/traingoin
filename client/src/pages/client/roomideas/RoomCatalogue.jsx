import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ShareProduct from "../ShareProduct/ShareProduct";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import "./roomCatalogue.css";
import { toastError } from "../../../utils/reactToastify.js";

import { REACT_APP_URL, axiosInstance } from "../../../config";
import {
  addToWhislist,
  removeToWhislist,
} from "../../../redux/slices/wishlistSlice";

import {
  addToWishlist,
  removeFromWishlist,
  getWishlistProductById,
} from "../../../redux/slices/newWishlistSlice";

import { AiTwotoneHeart } from "react-icons/ai";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import Rating from "../../../components/Rating/showingRating/Rating.jsx";

import SnackbarMessage from "../../../utils/snakbar/SnackbarMessage";
import {
  isCustomizedDotProductInWishlist,
  isSingleDotProductInWishlist,
} from "../../../utils/isInWishlist/isSingleProduct";

import { Slide, Fade } from "@mui/material";

function SlideTransition(props) {
  return (
    <Slide {...props} direction="up" vertical="bottom" horizontal="center" />
  );
}

const RoomCatalogue = ({ dotArr, type = "", model }) => {
  const { userdetails } = useSelector((state) => state.auth);
  const { whishlistdata } = useSelector((state) => state.whishlist);

  const { wishlistProductDetails, loading } = useSelector(
    (state) => state.wishlist
  );

  const dispatch = useDispatch();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [isWishlistProduct, setIsWishlistProduct] = useState(null);
  const [showShareModal, setshowShareModal] = useState(false);
  const [UserRatingData, setUserRatingData] = useState({
    totalRating: 0,
    totalUser: 0,
    ratingData: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  });

  const [state, setState] = React.useState({
    open: false,
    Transition: Fade,
    type: "",
    message: "",
  });

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      paritialVisibilityGutter: 60,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      paritialVisibilityGutter: 50,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      paritialVisibilityGutter: 30,
    },
  };

  const getTotalRating = useCallback(async () => {
    if (!dotArr?._id) {
      return null;
    }
    try {
      const { data } = await axiosInstance.get(
        `/api/review/product/totalRating/${dotArr?._id}?model=${model}`,
        {
          headers: {
            Auth: localStorage.getItem("token"),
          },
        }
      );
      setUserRatingData(data.data);
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }, [dotArr?._id, model]);

  useEffect(() => {
    if (userdetails && Object.keys(userdetails)?.length > 0 && dotArr?._id) {
      if (dotArr?.type === "singleDotProduct") {
        dispatch(
          getWishlistProductById({
            id: dotArr?._id,
            searchProduct: "singleDotProductId",
          })
        );
      } else {
        dispatch(
          getWishlistProductById({
            id: dotArr?._id,
            searchProduct: "customizeDotProductId",
          })
        );
      }
    }
  }, [dispatch, userdetails, dotArr]);

  useEffect(() => {
    if (
      Object.keys(userdetails)?.length > 0 &&
      wishlistProductDetails &&
      loading === "fulfilled"
    ) {
      setWishlistProducts(wishlistProductDetails);
    } else if (whishlistdata && Object.keys(userdetails)?.length === 0) {
      setWishlistProducts(whishlistdata);
    } else {
      setWishlistProducts([]);
    }
  }, [userdetails, wishlistProductDetails, loading, whishlistdata]);

  useEffect(() => {
    getTotalRating();
  }, [getTotalRating]);

  const handleAddToWishlist = async (product) => {
    try {
      const productId =
        dotArr?.type === "singleDotProduct"
          ? "singleDotProductId"
          : "customizeDotProductId";

      const productData = {
        [productId]: product,
      };

      if (Object.keys(userdetails)?.length > 0) {
        await dispatch(addToWishlist(productData)).unwrap();
        await dispatch(
          getWishlistProductById({
            id: dotArr?._id,
            searchProduct: productId,
          })
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
      const productId =
        dotArr?.type === "singleDotProduct"
          ? "singleDotProductId"
          : "customizeDotProductId";

      if (Object.keys(userdetails)?.length > 0) {
        await dispatch(removeFromWishlist(id)).unwrap();
        await dispatch(
          getWishlistProductById({
            id: dotArr?._id,
            searchProduct: productId,
          })
        ).unwrap();
      } else {
        dispatch(removeToWhislist(id)); // remove from local storage
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

  useEffect(() => {
    if (wishlistProducts) {
      const product =
        dotArr?.type === "singleDotProduct"
          ? isSingleDotProductInWishlist(wishlistProducts, dotArr?._id)
          : isCustomizedDotProductInWishlist(wishlistProducts, dotArr?._id);
      setIsWishlistProduct(product);
    }
  }, [dotArr, wishlistProducts]);

  const ShareModalClose = () => {
    setshowShareModal(false);
  };

  return (
    <>
      <SnackbarMessage setState={setState} state={state} />

      <ShareProduct
        ProductName={dotArr?.name}
        showShareModal={showShareModal}
        ShareModalClose={ShareModalClose}
      />

      <div className="row">
        <div className="col-sm-12">
          <div id="customers-testimonials" className="owl-carousel">
            {/*TESTIMONIAL 1 */}
            <div className="row HideInDesktop" style={{ display: "flex" }}>
              <div
                className="col-lg-12 d-flex"
                style={{ float: "left", marginTop: "-25px" }}
              >
                <Rating
                  totalRating={UserRatingData.totalRating}
                  totalUser={UserRatingData.totalUser}
                  ratingData={UserRatingData.ratingData}
                  productdetails={dotArr}
                  setUserRatingData={setUserRatingData}
                  getTotalRating={getTotalRating}
                  model={model}
                />

                <div
                  style={{ float: "right", marginLeft: "140px" }}
                  className="shareOpen1"
                  onClick={() => {
                    setshowShareModal(true);
                  }}
                >
                  <ShareIcon style={{ fontSize: "14px" }} />
                </div>

                {isWishlistProduct ? (
                  <IconButton
                    color="primary"
                    aria-label="dislike"
                    style={{
                      // position: "absolute",
                      // top: "10px",
                      // right: "10px",
                      float: "right",
                      zIndex: 2,
                      marginTop: "-20px",
                    }}
                    onClick={() =>
                      handleRemoveToWishlist(isWishlistProduct?._id)
                    }
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
                      // position: "absolute",
                      // top: "10px",
                      // right: "10px",
                      float: "right",
                      zIndex: 2,
                      marginTop: "-20px",
                    }}
                    onClick={() => handleAddToWishlist(dotArr?._id)}
                  >
                    <AiTwotoneHeart size={22} />
                  </IconButton>
                )}
              </div>
            </div>
            <div className="row HideInPhone" style={{ display: "flex" }}>
              <div className="col-lg-4" style={{ float: "left" }}>
                <Rating
                  totalRating={UserRatingData.totalRating}
                  totalUser={UserRatingData.totalUser}
                  ratingData={UserRatingData.ratingData}
                  productdetails={dotArr}
                  setUserRatingData={setUserRatingData}
                  getTotalRating={getTotalRating}
                  model={model}
                />
              </div>
              <div className="col-lg-6" style={{ float: "left" }}></div>
              <div className="col-lg-1" style={{ float: "left" }}>
                <div
                  style={{ float: "right" }}
                  className="shareOpen"
                  onClick={() => {
                    setshowShareModal(true);
                  }}
                >
                  <ShareIcon style={{ fontSize: "14px" }} />
                </div>
              </div>
              <div className="col-lg-1" style={{ float: "left" }}>
                {isWishlistProduct ? (
                  <IconButton
                    color="primary"
                    aria-label="dislike"
                    style={{
                      // position: "absolute",
                      // top: "10px",
                      // right: "10px",
                      float: "right",
                      zIndex: 2,
                      paddingTop: "15px",
                    }}
                    onClick={() =>
                      handleRemoveToWishlist(isWishlistProduct?._id)
                    }
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
                      // position: "absolute",
                      // top: "10px",
                      // right: "10px",
                      float: "right",
                      zIndex: 2,
                      paddingTop: "15px",
                    }}
                    onClick={() => handleAddToWishlist(dotArr?._id)}
                  >
                    <AiTwotoneHeart size={22} />
                  </IconButton>
                )}
              </div>
            </div>

            <Carousel
              responsive={responsive}
              itemClass="px-3"
              infinite={true}
              autoPlaySpeed={1000}
            >
              {dotArr &&
                dotArr?.dotProductImageIds?.length > 0 &&
                dotArr?.dotProductImageIds?.map((item, index) => {
                  return <CarousalItem key={index} dotArr={item} type={type} />;
                })}
            </Carousel>
          </div>
        </div>
      </div>
    </>
  );
};

const CarousalItem = ({ dotArr, type = "" }) => {
  return (
    <>
      <div className="shadow-effect">
        <div
          // className="item-details"
          style={{
            // boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
            textAlign: "center",
            // border: "1px solid #475B52",
            // borderRadius: 10,
            backgroundColor: "#fff",
            // padding: 30,
          }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              className="img-fluid roomideacarouselstyle"
              loading="lazy"
              src={`${REACT_APP_URL}/images/dotimage/${dotArr?.image}`}
              alt=""
            />
            {dotArr?.dots?.map((p, i) => {
              return (
                <React.Fragment key={p._id}>
                  <div
                    className="Dot fa fa-circle text-danger-glow blink"
                    style={{
                      left: `${p.positionX}%`,
                      top: `${p.positionY}%`,
                    }}
                  ></div>

                  <span
                    className="blink"
                    style={{
                      left: `${p.positionX + 4}%`,
                      top: `${p.positionY + 1}%`,
                      position: "absolute",
                      backgroundColor: "#3e6554",
                      padding: "2px 10px 2px 10px",
                      borderRadius: "3px",
                      border: "1px solid #fff",
                    }}
                  >
                    <Link
                      to={`/${type ? "product" : "customized-product"}/${
                        p?.productId?.Collection[0]?.url
                      }/${p?.productId?.Urlhandle}`}
                    >
                      <p style={{ color: "#fff" }}>
                        {p?.productId?.ProductName.slice(0, 20)}
                      </p>
                    </Link>
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomCatalogue;
