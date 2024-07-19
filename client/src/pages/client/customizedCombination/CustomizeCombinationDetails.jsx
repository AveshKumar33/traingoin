import React, { useEffect, useState, useCallback } from "react";
import HeaderImage from "../../../assets/Image/Slider11.jpg";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { axiosInstance, REACT_APP_URL } from "../../../config";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomizedComboProductRectangleDetailsForCiient } from "../../../redux/slices/customizeComboRectangleSlice";
import CustomizedCombinationDetailsCard from "./CustomizedCombinationDetailsCard";
import Preloader from "../../../components/preloader/Preloader";
import { getPrice } from "../../../utils/varientimge/getPrice";
import CustomizeProductCard from "./CustomizeProductCard";
import ShareIcon from "@mui/icons-material/Share";
import { AiTwotoneHeart } from "react-icons/ai";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "./CustomizeCombinationDetails.css";
// import { AiOutlineShoppingCart } from "react-icons/ai";
import ShareProduct from "../ShareProduct/ShareProduct";
import { toastSuceess, toastError } from "../../../utils/reactToastify.js";
import {
  addToWhislist,
  removeToWhislist,
} from "../../../redux/slices/wishlistSlice";

import { fetchUOM } from "../../../redux/slices/UOMSlice.js";

import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlistCustomizedComboProducts,
  fetchWishlistCustomizedComboProductById,
} from "../../../redux/slices/newWishlistSlice";

import {
  getCartCustomizeComboProduct,
  addToCart,
} from "../../../redux/slices/newCartSlice";

import { addTocart } from "../../../redux/slices/cartSlice";

import { isCustomizedComboProductInWishlist } from "../../../utils/isInWishlist/isCustomizeComboProduct";
import SnackbarMessage from "../../../utils/snakbar/SnackbarMessage.jsx";
import Rating from "../../../components/Rating/showingRating/Rating.jsx";
import AddToCartButton from "../../../UI/AddToCartButton.jsx";

import { Slide, Fade } from "@mui/material";

function SlideTransition(props) {
  return (
    <Slide {...props} direction="up" vertical="bottom" horizontal="center" />
  );
}

const calculateCustomizedPrice = (
  productDetails,
  combinations,
  UOM,
  priceFor
) => {
  if (productDetails && combinations?.length > 0) {
    const { DefaultWidth, DefaultHeight } = productDetails || {};

    const totalCustomizedPrice =
      productDetails[priceFor] +
      getPrice(productDetails, combinations, UOM, {
        DefaultHeight,
        DefaultWidth,
      });

    return totalCustomizedPrice;
  }
  return 0;
};

const getCombinationData = (combinations, populatedCombination) => {
  const sortedCombinations = [...combinations].sort((a, b) =>
    a.attributeId.localeCompare(b.attributeId)
  );
  const sortedPopulatedCombination = [...populatedCombination].sort((a, b) =>
    a.attributeId._id.localeCompare(b.attributeId._id)
  );

  return sortedCombinations.map((data, index) => ({
    ...data,
    attributeId: {
      ...sortedPopulatedCombination[index].attributeId,
      UOMId: sortedPopulatedCombination[index].attributeId.UOMId?._id,
    },
    combinations: [
      {
        ...sortedPopulatedCombination[index],
        attributeId: {
          ...sortedPopulatedCombination[index].attributeId,
          UOMId: sortedPopulatedCombination[index].attributeId.UOMId?._id,
        },
        parameterId: {
          ...sortedPopulatedCombination[index].parameterId,
          attributeId: sortedPopulatedCombination[index].attributeId._id,
        },
      },
    ],
  }));
};

const CustomizeCombinationDetails = () => {
  const { whishlistdata } = useSelector((state) => state.whishlist);
  const { userdetails } = useSelector((state) => state.auth);

  const model = "customizedCombo";
  const { productId } = useParams();
  const { loading, customizedComboProductRectangleDetails } = useSelector(
    (state) => state.customizeComboRectangle
  );

  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const isWishlist = searchParams.get("isWishlist");
  const isArchitect = searchParams.get("isArchitect");

  const {
    customizedComboProductById,
    customizedComboProducts,
    loading: wishlistProductLoading,
  } = useSelector((state) => state.wishlist);

  const { uoms } = useSelector((state) => state.uoms);

  const { cartdata } = useSelector((state) => state.cart);
  const {
    addedCartProduct,
    cartCustomizeComboProduct,
    cartCustomizeComboProductLoading,
  } = useSelector((state) => state.newCartSlice);

  const [productDetails, setProductDetails] = useState();
  const [comboRectangle, setComboRectangle] = useState([]);
  const [selectedCustomizedProduct, setSelectedCustomizedProduct] = useState(
    []
  );
  const [wishlistProduct, setWishListProduct] = useState(null);
  const [wishlistProductIds, setWishListProductIds] = useState([]);
  const [currentCombination, setCurrentCombiation] = useState();
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
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState();
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
        `/api/header-image/title/CustomizeCombinationDetails`
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
    if (!isWishlist) {
      dispatch(fetchCustomizedComboProductRectangleDetailsForCiient(productId));
    }
  }, [dispatch, productId, isWishlist]);

  useEffect(() => {
    if (userdetails && Object.keys(userdetails).length > 0) {
      dispatch(getCartCustomizeComboProduct({ id: userdetails?._id }));
    }
  }, [dispatch, userdetails]);

  useEffect(() => {
    if (isWishlist || isArchitect) {
      const isEmptyUserDetails =
        !userdetails || Object.keys(userdetails).length === 0;
      const userId = isEmptyUserDetails ? "unauthenticated" : userdetails._id;

      let searchData = [];

      if (isEmptyUserDetails) {
        searchData = whishlistdata.filter(
          (data) => data?._id.toString() === isWishlist.toString()
        );
      }

      if (isWishlist && !isArchitect) {
        Promise.all([
          dispatch(
            fetchWishlistCustomizedComboProductById({
              product: isEmptyUserDetails ? searchData : [],
              userId,
              id: isWishlist,
            })
          ),

          dispatch(fetchUOM()),
        ]);
      } else if (isWishlist && isArchitect) {
        Promise.all([
          dispatch(
            fetchWishlistCustomizedComboProductById({
              product: [],
              userId: isArchitect,
              id: isWishlist,
            })
          ),

          dispatch(fetchUOM()),
        ]);
      }
    }
  }, [dispatch, isWishlist, isArchitect, whishlistdata, userdetails]);

  // useEffect(() => {
  //   if (
  //     wishlistProductLoading === "fulfilled" &&
  //     customizedComboProductById &&
  //     customizedComboProductById?.length > 0 &&
  //     uoms &&
  //     uoms?.length > 0 &&
  //     isWishlist
  //   ) {
  //     const fetchedData = customizedComboProductById[0];

  //     const updatedData = {
  //       customizedComboId: fetchedData?.customizedComboId,
  //       _id: fetchedData?.customizedComboId?._id,
  //       rectangles: [],
  //     };

  //     const combinationData = (combinations, populatedCombination) => {
  //       const sortedCombinations = combinations
  //         ?.slice()
  //         ?.sort((a, b) => a.attributeId.localeCompare(b.attributeId));

  //       const sortedPopulatedCombination = populatedCombination
  //         ?.slice()
  //         ?.sort((a, b) => {
  //           const idA = a.attributeId?._id;
  //           const idB = b.attributeId?._id;
  //           return idA.localeCompare(idB);
  //         });

  //       let newData = sortedCombinations.map((data, index) => {
  //         return {
  //           ...data,
  //           attributeId: {
  //             ...sortedPopulatedCombination[index]?.attributeId,
  //             UOMId: sortedPopulatedCombination[index]?.attributeId?.UOMId?._id,
  //           },
  //           combinations: [
  //             {
  //               ...sortedPopulatedCombination[index],
  //               attributeId: {
  //                 ...sortedPopulatedCombination[index]?.attributeId,
  //                 UOMId:
  //                   sortedPopulatedCombination[index]?.attributeId?.UOMId?._id,
  //               },
  //               parameterId: {
  //                 ...sortedPopulatedCombination[index]?.parameterId,
  //                 attributeId:
  //                   sortedPopulatedCombination[index]?.attributeId?._id,
  //               },
  //             },
  //           ],
  //         };
  //       });

  //       return newData;
  //     };

  //     for (let rect of fetchedData?.customizedComboRectangle) {
  //       let customizedData = [];

  //       const Front = combinationData(rect.Front, rect?.FrontCombinations);
  //       const SAF = combinationData(rect.SAF, rect?.SAFCombinations);
  //       const CB = combinationData(rect.CB, rect?.CBCombinations);
  //       const IB = combinationData(rect.IB, rect?.IBCombinations);
  //       const product = [rect?.customizedProductId];
  //       const UOM = uoms;

  //       customizedData.push({ Front, SAF, CB, IB, product, UOM });

  //       updatedData?.rectangles.push({
  //         ...rect?.customizedComboRectangleId,
  //         customizedProductDetails: customizedData,
  //         productDetails: [fetchedData?.customizedComboId],
  //       });
  //     }

  //     setProductDetails(updatedData);
  //     setComboRectangle(updatedData?.rectangles);

  //     const rec = updatedData?.rectangles?.map((rectange) => {
  //       return {
  //         ...rectange,
  //         customizedProductDetails: rectange?.customizedProductDetails[0],
  //       };
  //     });

  //     if (rec?.length > 0) {
  //       setSelectedCustomizedProduct([...rec]);
  //     }
  //   }
  // }, [wishlistProductLoading, customizedComboProductById, uoms, isWishlist]);

  useEffect(() => {
    if (
      wishlistProductLoading !== "fulfilled" ||
      !customizedComboProductById ||
      customizedComboProductById.length === 0 ||
      !uoms ||
      uoms.length === 0 ||
      !isWishlist
    ) {
      return; // Exit early if any of the dependencies are not fulfilled
    }

    const fetchedData = customizedComboProductById[0];

    const updatedData = {
      customizedComboId: fetchedData.customizedComboId,
      _id: fetchedData.customizedComboId?._id,
      rectangles: fetchedData.customizedComboRectangle.map((rect) => ({
        ...rect.customizedComboRectangleId,
        customizedProductDetails: [
          {
            Front: getCombinationData(rect.Front, rect.FrontCombinations),
            SAF: getCombinationData(rect.SAF, rect.SAFCombinations),
            CB: getCombinationData(rect.CB, rect.CBCombinations),
            IB: getCombinationData(rect.IB, rect.IBCombinations),
            product: [rect.customizedProductId],
            UOM: uoms,
          },
        ],
        productDetails: [fetchedData.customizedComboId],
      })),
    };

    setProductDetails(updatedData);
    setComboRectangle(updatedData.rectangles);

    setSelectedCustomizedProduct(
      updatedData.rectangles.map((rectange) => ({
        ...rectange,
        customizedProductDetails: rectange.customizedProductDetails[0],
      }))
    );
  }, [wishlistProductLoading, customizedComboProductById, uoms, isWishlist]);

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
      setWishListProductIds(customizedComboProducts);
    } else if (Object.keys(userdetails).length === 0 && whishlistdata) {
      setWishListProductIds(whishlistdata);
    }
  }, [
    userdetails,
    wishlistProductLoading,
    customizedComboProducts,
    whishlistdata,
  ]);

  useEffect(() => {
    if (
      loading === "fulfilled" &&
      customizedComboProductRectangleDetails?.length > 0 &&
      !isWishlist
    ) {
      const product = customizedComboProductRectangleDetails[0];

      setProductDetails(product);
      setComboRectangle(product?.rectangles);

      const rec = product?.rectangles?.map((rectange) => {
        return {
          ...rectange,
          customizedProductDetails: rectange?.customizedProductDetails[0],
        };
      });

      if (rec?.length > 0) {
        setSelectedCustomizedProduct([...rec]);
      }
    }
  }, [loading, customizedComboProductRectangleDetails, isWishlist]);

  const getTotalRating = useCallback(async () => {
    if (!productDetails?.customizedComboId?._id) {
      return null;
    }
    try {
      const { data } = await axiosInstance.get(
        `/api/review/product/totalRating/${productDetails?.customizedComboId?._id}?model=${model}`,
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
  }, [productDetails?.customizedComboId?._id]);

  useEffect(() => {
    getTotalRating();
  }, [getTotalRating]);

  const handleSelectedCustomizedProduct = (rectangle, customizedProduct) => {
    const selectedProd = [...selectedCustomizedProduct];

    const updatedProd = selectedProd.map((prod) =>
      prod?._id === rectangle?._id
        ? { ...prod, customizedProductDetails: customizedProduct }
        : prod
    );

    setSelectedCustomizedProduct([...updatedProd]);
  };
  const ShareModalClose = () => {
    setshowShareModal(false);
  };

  // setting aded cart product
  useEffect(() => {
    if (addedCartProduct) {
      setCartProductIds((prevState) => [...prevState, addedCartProduct]);
    }
  }, [addedCartProduct]);

  // setting fetched cart product
  useEffect(() => {
    if (
      cartCustomizeComboProductLoading === "fulfilled" &&
      cartCustomizeComboProduct &&
      userdetails &&
      Object.keys(userdetails).length > 0
    ) {
      setCartProductIds(cartCustomizeComboProduct);
    } else if (
      cartdata?.length > 0 &&
      userdetails &&
      Object.keys(userdetails).length === 0
    ) {
      const updatedCart = [...cartdata];

      const filteredData = updatedCart.filter(
        (product) => product?.customizedComboId
      );

      setCartProductIds(filteredData);
    }
  }, [
    cartCustomizeComboProduct,
    cartCustomizeComboProductLoading,
    userdetails,
    cartdata,
  ]);

  const handleAddToWishlist = async (customizedCombinations, product) => {
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
        customizedComboId: product?._id,
        customizedComboRectangle: rectangleData,
      };

      if (Object.keys(userdetails)?.length > 0) {
        await dispatch(addToWishlist(productData)).unwrap();
        // await dispatch(fetchWishlistForProductList()).unwrap();
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
        // await dispatch(fetchWishlistForProductList()).unwrap();
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

  const handleAddTocart = async (customizedCombinations, product) => {
    try {
      setStatus("adding");
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
        customizedComboId: product?._id,
        customizedComboRectangle: rectangleData,
        archId: isArchitect,
      };

      if (Object.keys(userdetails)?.length > 0) {
        await dispatch(addToCart(productData)).unwrap();
        setStatus("added");
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

  // for wishlist
  useEffect(() => {
    if (
      wishlistProductIds?.length > 0 &&
      currentCombination &&
      currentCombination?.length > 0 &&
      userdetails &&
      Object.keys(userdetails).length > 0
    ) {
      const data = isCustomizedComboProductInWishlist(
        currentCombination,
        wishlistProductIds
      );
      setWishListProduct(data);
    } else if (
      whishlistdata?.length > 0 &&
      currentCombination &&
      currentCombination?.length > 0 &&
      Object.keys(userdetails).length === 0
    ) {
      const data = isCustomizedComboProductInWishlist(
        currentCombination,
        wishlistProductIds
      );

      setWishListProduct(data);
    } else {
      setWishListProduct(null);
    }
  }, [wishlistProductIds, currentCombination, userdetails, whishlistdata]);

  // for cart
  useEffect(() => {
    if (
      cartProductIds?.length > 0 &&
      currentCombination &&
      currentCombination?.length > 0
    ) {
      const data = isCustomizedComboProductInWishlist(
        currentCombination,
        cartProductIds
      );

      if (data) {
        setStatus("added");
        setCartProduct(data);
      }
    }
    // else if (
    //   cartdata?.length > 0 &&
    //   currentCombination &&
    //   currentCombination?.length > 0 &&
    //   Object.keys(userdetails).length === 0
    // ) {
    //   const data = isCustomizedComboProductInWishlist(
    //     currentCombination,
    //     cartProductIds
    //   );

    //   if (data) {
    //     setStatus("added");
    //     setCartProduct(data);
    //   }
    // }
    else {
      setCartProduct(null);
    }
  }, [cartProductIds, currentCombination, userdetails, cartdata]);

  if (loading === "pending") {
    return <Preloader />;
  }

  return (
    <>
      <SnackbarMessage setState={setState} state={state} />
      <StickySidebar />
      <MainHeader isImageAvailable={headerImage?.pngImage ? true : false} />
      <ShareProduct
        ProductName={productDetails?.Name}
        showShareModal={showShareModal}
        ShareModalClose={ShareModalClose}
      />

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
      </div>

      <div className="row">
        <div className={`col-md-6 mt-2 mb-5`} style={{ float: "left" }}>
          {productDetails && (
            <CustomizedCombinationDetailsCard
              colnumber="6"
              id={productDetails?._id}
              product={productDetails}
              setComboRectangle={setComboRectangle}
              comboRectangle={comboRectangle}
              selectedCustomizedProduct={selectedCustomizedProduct}
              isShownBottomData={false}
              setTotalPrice={setTotalPrice}
              setCurrentCombiation={setCurrentCombiation}
            />
          )}
        </div>
        <div className={`col-md-6 mt-2 mb-5`} style={{ float: "left" }}>
          <h1
            className="text-center pb-2"
            style={{
              fontSize: "16px",
              textTransform: "uppercase",
              fontWeight: "600",
              marginTop: "15px",
              marginBottom: "15px",
            }}
          >
            <span
              style={{
                backgroundColor: "#475B52",
                color: "#fff",
                padding: "10px 20px 10px 20px",
              }}
            >
              {productDetails?.customizedComboId?.Name}
            </span>
          </h1>
          <p
            style={{
              color: "#000",
              fontSize: "16px",
              textAlign: "justify",
              padding: "0px 30px 0px 30px",
            }}
          >
            {productDetails?.customizedComboId?.Description}
          </p>
          <p
            style={{
              color: "#000",
              fontSize: "18px",
              fontWeight: "600",
              padding: "0px 30px 0px 30px",
            }}
          >
            Rs. {totalPrice}
          </p>
          <div className="row" style={{ paddingLeft: "30px" }}>
            <div className="col-lg-6 CustomizedComboDiv1">
              <Rating
                totalRating={UserRatingData.totalRating}
                totalUser={UserRatingData.totalUser}
                ratingData={UserRatingData.ratingData}
                productdetails={productDetails?.customizedComboId}
                setUserRatingData={setUserRatingData}
                getTotalRating={getTotalRating}
                model={model}
              />
            </div>
            <div className="col-lg-4 CustomizedComboDiv2"></div>
            <div className="col-lg-1 CustomizedComboDiv3">
              {wishlistProduct ? (
                <IconButton
                  color="primary"
                  aria-label="dislike"
                  style={{
                    top: "5px",
                    right: "10px",
                    zIndex: 100,
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
                    top: "5px",
                    right: "10px",
                    zIndex: 100,
                  }}
                  onClick={() =>
                    handleAddToWishlist(currentCombination, productDetails)
                  }
                >
                  <AiTwotoneHeart size={22} />
                </IconButton>
              )}
            </div>
            <div
              className="col-lg-1 CustomizedComboDiv3"
              style={{ paddingTop: "10px" }}
            >
              <div
                onClick={() => {
                  setshowShareModal(true);
                }}
              >
                <ShareIcon
                  style={{
                    fontSize: "22px",
                  }}
                />
              </div>
            </div>
          </div>
          <center>
            <AddToCartButton
              onClick={() => {
                if (!cartProduct) {
                  handleAddTocart(currentCombination, productDetails);
                } else {
                  navigate("/cart");
                }
              }}
              status={status}
            />
            {/* <button
              type="button"
              className="button"
              style={{ backgroundColor: "#475B52", marginTop: "5px" }}
              onClick={() => {
                alert("Sorry For Incounvience!. Add to cart work in progress!");
              }}
            >
              Add To Cart
            </button> */}
          </center>
        </div>

        <div
          className={`col-md-12 mb-5`}
          style={{ paddingTop: "10px", float: "left" }}
        >
          <>
            {comboRectangle &&
              comboRectangle?.length > 0 &&
              comboRectangle?.map((prod, index) => {
                return (
                  <div
                    className="row"
                    style={{ padding: "0px 20px 20px 20px" }}
                  >
                    <React.Fragment key={index}>
                      <h1
                        style={{
                          fontSize: "20px",
                          textTransform: "uppercase",
                          fontWeight: "600",
                        }}
                      >
                        {prod?.name}
                      </h1>
                      <br></br>
                      <br></br>
                      {prod?.customizedProductDetails?.map((customizedProd) => {
                        const isSelected = selectedCustomizedProduct.find(
                          (product) =>
                            product?.customizedProductDetails?._id ===
                              customizedProd?._id && prod?._id === product?._id
                        );
                        return (
                          <div
                            className="col-md-4"
                            key={customizedProd?._id}
                            // onClick={() =>
                            //   handleSelectedCustomizedProduct(
                            //     prod,
                            //     customizedProd
                            //   )
                            // }
                          >
                            <CustomizeProductCard
                              key={customizedProd?._id}
                              product={customizedProd}
                              calculateCustomizedPrice={
                                calculateCustomizedPrice
                              }
                              prod={prod}
                              handleSelectedCustomizedProduct={
                                handleSelectedCustomizedProduct
                              }
                              isSelected={isSelected}
                            />
                          </div>
                        );
                      })}
                    </React.Fragment>
                  </div>
                );
              })}
          </>
        </div>
      </div>
      {/* </div> */}

      <MainFooter />
    </>
  );
};

export default CustomizeCombinationDetails;
