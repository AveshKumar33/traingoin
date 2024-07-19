import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import Carousel from "../../../UI/Carousel";
import { REACT_APP_URL } from "../../../config";
import { AiTwotoneHeart } from "react-icons/ai";
import {
  addToWhislist,
  removeToWhislist,
} from "../../../redux/slices/wishlistSlice.js";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlistDotProducts,
  fetchDotProductsWishlist,
} from "../../../redux/slices/newWishlistSlice.js";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import "./RoomIdea.css";
import SnackbarMessage from "../../../utils/snakbar/SnackbarMessage";
import { fetchWishlistForProductList } from "../../../redux/slices/newWishlistSlice.js";

import { Slide, Fade } from "@mui/material";

function SlideTransition(props) {
  return (
    <Slide {...props} direction="up" vertical="bottom" horizontal="center" />
  );
}

const DotCustomizeProductCardRoomIdea = ({
  removeProduct,
  dotproduct,
  wishlistData = [],
  isProductInWishlist = () => {},
  isWishlist = false,
  isArchitect = false,
}) => {
  const { whishlistdata } = useSelector((state) => state.whishlist);
  const dispatch = useDispatch();

  const { userdetails } = useSelector((state) => state.auth);

  const [wishlistProductIds, setWishListProductIds] = useState([]);

  const [state, setState] = React.useState({
    open: false,
    Transition: Fade,
    type: "",
    message: "",
  });

  useEffect(() => {
    if (wishlistData && userdetails && Object.keys(userdetails)?.length > 0) {
      setWishListProductIds(wishlistData);
    } else if (userdetails && Object.keys(userdetails)?.length === 0) {
      setWishListProductIds(whishlistdata);
    }
  }, [wishlistData, userdetails, whishlistdata]);

  const handleAddToWishlist = async (product) => {
    try {
      const productData = {
        customizeDotProductId: product,
      };
      if (userdetails && Object.keys(userdetails)?.length > 0) {
        await dispatch(addToWishlist(productData)).unwrap();
        await dispatch(fetchWishlistForProductList()).unwrap();
      } else {
        dispatch(addToWhislist({ _id: Date.now(), ...productData })); // saving in local storage
      }

      if (isArchitect && userdetails && Object.keys(userdetails)?.length > 0) {
        dispatch(
          fetchDotProductsWishlist({
            userId: userdetails?._id,
          })
        );
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
        dispatch(
          fetchDotProductsWishlist({
            userId: userdetails?._id,
          })
        );
      }

      if (isWishlist && Object.keys(userdetails)?.length > 0) {
        dispatch(
          fetchWishlistDotProducts({ product: [], userId: userdetails?._id })
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

  // console.log("wishlistProductIds", wishlistProductIds);

  return (
    <>
      <SnackbarMessage setState={setState} state={state} />

      <div className={`col-lg-6 buyfromelevationcard`}>
        <div className="ProductCardHoverroomidea">
          <center>
            <div className="containers">
              {isProductInWishlist(wishlistProductIds, dotproduct?._id) ? (
                <IconButton
                  color="primary"
                  aria-label="dislike"
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 2,
                  }}
                  onClick={() =>
                    handleRemoveToWishlist(
                      isProductInWishlist(wishlistProductIds, dotproduct?._id)
                        ?._id
                    )
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
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 2,
                  }}
                  onClick={() => handleAddToWishlist(dotproduct?._id)}
                >
                  <AiTwotoneHeart size={22} />
                </IconButton>
              )}

              <Link
                to={`/customize-room-idea/${dotproduct._id}`}
                target="_blanck"
              >
                <div>
                  <div
                    className="ImageContainer"
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <div>
                      {dotproduct?.dotProductImageIds[0] &&
                        dotproduct?.dotProductImageIds[0]?.video && (
                          <iframe
                            className="card-img-top RoomIdeaImageStyle buyfromelevationcardimage"
                            src={dotproduct?.dotProductImageIds[0]?.video}
                            title={dotproduct?.name}
                            frameborder="5"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen
                          />
                        )}
                      {dotproduct?.dotProductImageIds[0]?.image && (
                        <img
                          loading="lazy"
                          src={`${REACT_APP_URL}/images/dotimage/${dotproduct?.dotProductImageIds[0]?.image}`}
                          className="card-img-top RoomIdeaImageStyle imageLoader buyfromelevationcardimage"
                          alt={dotproduct?.name}
                        />
                      )}
                    </div>

                    {dotproduct?.dotProductImageIds[0]?.dots?.map((p, i) => {
                      return (
                        <React.Fragment key={i}>
                          <div
                            className="Dot fa fa-circle text-danger-glow blink"
                            key={p._id}
                            // onClick={() => handleModal(i, p.productId)}
                            style={{
                              left: `${p.positionX}%`,
                              top: `${p.positionY}%`,
                            }}
                          ></div>
                          {/*  ed */}
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
                              to={`/customized-product/${p?.productId?.Collection[0]?.url}/${p?.productId?.Urlhandle}`}
                              target="_blanck"
                            >
                              <p style={{ color: "#fff" }}>
                                {p?.productId?.ProductName.slice(0, 10)}
                              </p>
                            </Link>
                          </span>
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <div style={{ padding: "10px" }}>
                    <Link
                      to={`/customize-room-idea/${dotproduct._id}`}
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
                        {dotproduct.name}
                      </h6>
                    </Link>
                  </div>

                  {removeProduct && (
                    <>
                      <button
                        onClick={() => removeProduct(dotproduct._id)}
                        className="btn btn-primary"
                      >
                        Remove Product
                      </button>
                    </>
                  )}
                </div>
                <br></br>
              </Link>
            </div>
          </center>
        </div>
      </div>
    </>
  );
};

export default DotCustomizeProductCardRoomIdea;
