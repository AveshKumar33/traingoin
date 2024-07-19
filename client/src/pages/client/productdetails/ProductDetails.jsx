/* eslint-disable react/prop-types */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import debounce from "lodash/debounce";

import { useLocation, useNavigate } from "react-router-dom";
import { REACT_APP_URL } from "../../../config";
// import SliderImg1 from "../../../assets/Image/Slider11.jpg";
import ShareIcon from "@mui/icons-material/Share";
// import { DotProductcard } from "../../client/roomideas/RoomIdea.jsx";
import AddIcon from "@mui/icons-material/Add";
import Accrodianitem from "./Accrodianitem";
import RemoveIcon from "@mui/icons-material/Remove";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
// import HeaderImage from "../../../assets/Image/Slider11.jpg";
import RoomSliderCusProd from "../../client/roomideas/RoomSliderCusProd";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
// import ClientTestimonial from "../../../components/clienttestimonial/ClientTestimonial";
// import Carousel from "react-multi-carousel";
import MainFooter from "../../../components/mainfooter/MainFooter";
import "./productdetails.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  fetchProductsDetailsByUrl,
  fetchdotProductDetailsByProductId,
} from "../../../redux/slices/newProductSlice";
import { getAllSingleProductParameterByAttributeId } from "../../../redux/slices/parameterSlice";
import { fetchOrderProductByOrderItemId } from "../../../redux/slices/orderSlice.js";
import { addTocart } from "../../../redux/slices/cartSlice";
// import CartSidebar from "../../../components/CartSidebar/CartSidebar.jsx";
import { axiosInstance } from "../../../config";
import Preloader from "../../../components/preloader/Preloader";
import { Helmet } from "react-helmet";
import { toastError, toastSuceess } from "../../../utils/reactToastify";
import ProductPdfComponents from "../../../components/productpdfcomponents/ProductPdfComponents";
import { DotCusProductcard } from "../home/DotCusProductcard";

import Modal from "../../../components/modal/Modal";
import ShareProduct from "../ShareProduct/ShareProduct";
import Rating from "../../../components/Rating/showingRating/Rating";
import { FinialAmount, getPercentage } from "../../../utils/usefullFunction";
// import ProductImageSection from "./ProductImageSection";
// import ProductTestimonial from "./ProductTestimonial";
// import Accrodianitem from "./Accrodianitem";
import ParameterModel from "./ParameterModel";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import RaiseAQuery from "../RaiseAQuery/RaiseAQuery.jsx";
import { AiTwotoneHeart } from "react-icons/ai";
import {
  addToWhislist,
  removeToWhislist,
} from "../../../redux/slices/wishlistSlice";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlistProductById,
  getSingleProductByWishlistId,
} from "../../../redux/slices/newWishlistSlice";

import {
  addToCart,
  getCartSingleProduct,
  fetchCartProductById,
} from "../../../redux/slices/newCartSlice.js";

import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
// import SettingsIcon from "@mui/icons-material/Settings";

import SnackbarMessage from "../../../utils/snakbar/SnackbarMessage";
import { isSingleProductInWishlist } from "../../../utils/isInWishlist/isSingleProduct.js";
import AddToCartButton from "../../../UI/AddToCartButton.jsx";

import { Slide, Fade } from "@mui/material";
import FeelFreeToContactUs from "../home/FeelFreeToContactUs.jsx";

import { updateCartProductQuantity } from "../../../redux/slices/newCartSlice.js";

function SlideTransition(props) {
  return (
    <Slide {...props} direction="up" vertical="bottom" horizontal="center" />
  );
}

// export function findObjectFromArray(searchObj, arr = [], newuseStateobjectId) {
//   // for (let i = 0; i < arr.length; i++) {
//   //   const currentObj = arr[i];
//   //   let isMatch = true;

//   //   for (const key of Object.keys(searchObj)) {
//   //     if (searchObj[key] !== currentObj[key]) {
//   //       isMatch = false;
//   //       break;
//   //     }
//   //   }

//   //   if (isMatch) {
//   //     for (const key in currentObj) {
//   //       currentObj[`${key}Id`] = newuseStateobjectId[`${key}Id`];
//   //     }
//   //     return currentObj;
//   //   }
//   // }

//   return {};
// }

const ProductDetails = () => {
  const componentRef = useRef(null);
  const model = "singleProduct";

  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const isWishlist = searchParams.get("isWishlist");
  const rfpId = searchParams.get("rfp_id") ?? "";
  const cartId = searchParams.get("cartId") ?? "";
  const isArchitect = searchParams.get("isArchitect");
  const productType = searchParams.get("productType");
  const orderId = searchParams.get("orderId");
  const orderItemId = searchParams.get("orderItemId");

  const { userdetails } = useSelector((state) => state.auth);
  const { whishlistdata } = useSelector((state) => state.whishlist);
  const { product } = useSelector((state) => state.orders);
  let { loading, productdetails, allDotproducts, productCombinations } =
    useSelector((state) => state.newProducts);

  const {
    wishlistProductDetails,
    loading: wishlistLoading,
    singleWishlistProduct,
  } = useSelector((state) => state.wishlist);

  let { singleProdParameters, loading: parameterLoading } = useSelector(
    (state) => state.parameters
  );

  const { cartdata } = useSelector((state) => state.cart);
  const { addedCartProduct, cartSingleProduct, cartSingleLoading, cartItem } =
    useSelector((state) => state.newCartSlice);
  const dispatch = useDispatch();

  const defaultProductCombination = productCombinations[0];

  const { collectionurl, productname } = useParams();
  const [ShowRaiseAQueryModal, setShowRaiseAQueryModal] = useState(false);
  const [DescriptionsData, setDescriptionsData] = useState([]);
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
  const [combinationData, setCombinationData] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [isWishlistProducts, setIsWishlistProducts] = useState(null);
  const [productDetails, setProductDetails] = useState();
  const [selectedCombination, setSelectedCombination] = useState({});
  const [selectedParameter, setSelectedParameter] = useState();
  const [rootCollection, setRootCollection] = useState([]);
  // const [managecart, setmanagecart] = useState(false);
  const [productdata, setproductdata] = useState([]);
  const [reviewdata, setreviewdata] = useState([]);
  const [buyingType, setbuyingType] = useState("Normal");
  const [Breadcrumbs, setBreadcrumbs] = useState({});
  const [status, setStatus] = useState("removed");
  const [cartProduct, setCartProduct] = useState(null);
  const [cartProductIds, setCartProductIds] = useState([]);
  const [cartProductQuantity, setCartProductQuantity] = useState(1);
  const [state, setState] = React.useState({
    open: false,
    Transition: Fade,
    type: "",
    message: "",
  });

  const [open, setOpen] = React.useState(false);
  /**fetch contactUsImage && contactUsVideo */
  const [contactUs, setContactUs] = useState({});
  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/ProductDetails`
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
  /** all single product order of users   */
  useEffect(() => {
    if (orderItemId && orderId && productType) {
      dispatch(
        fetchOrderProductByOrderItemId({ orderItemId, orderId, productType })
      );
    }
  }, [dispatch, orderItemId, orderId, productType]);

  useEffect(() => {
    if (loading === "fulfilled" && product && product.length > 0) {
      const singleProductCombinations =
        product[0]?.singleProductCombinations?.map((combination, index) => ({
          attributeId: combination?.attributeId,
          parameterId: combination?.parameterId,
          productId: product[0]?.singleProductId?._id,
        }));
      setCombinationData(singleProductCombinations);
    }
  }, [loading, product]);

  useEffect(() => {
    async function featchAllContactUsData() {
      try {
        const { data } = await axiosInstance.get(
          `/api/partner-with-us/contactUs/details`
        );
        if (data.success) {
          setContactUs(data.data);
        }
      } catch (error) {
        toastError(error?.response?.data?.message);
      }
    }
    featchAllContactUsData();
  }, []);

  /**get perticuler req for price document from rise query model */
  useEffect(() => {
    async function getAllRequestForPriceProduct() {
      try {
        const { data } = await axiosInstance.get(
          `/api/raiseAQuery/single-product/combination/${rfpId}`
        );

        if (data?.success) {
          const singleProductCombinations =
            data?.data[0]?.singleProductCombinations.map(
              (combination, index) => ({
                attributeId: combination?.attributeId,
                parameterId: combination?.parameterId,
                productId: data?.data[0]?.singleProductId,
              })
            );

          setCombinationData(singleProductCombinations);
        }
      } catch (error) {
        console.log(error);
        toastError(error?.response?.data?.message);
      }
    }
    if (rfpId) {
      getAllRequestForPriceProduct();
    }
  }, [rfpId]);

  useEffect(() => {
    dispatch(fetchProductsDetailsByUrl(productname));
  }, [dispatch, productname]);

  /**get cart item from the cart */
  useEffect(() => {
    if (cartId) {
      dispatch(fetchCartProductById(cartId));
    }
  }, [dispatch, cartId]);
  /**set cart item  */
  useEffect(() => {
    if (
      cartId &&
      cartItem &&
      Object.keys(cartItem).length > 0 &&
      cartItem?.singleProductCombinations
    ) {
      const singleProductCombinations = cartItem?.singleProductCombinations.map(
        (combination, index) => ({
          attributeId: combination?.attributeId,
          parameterId: combination?.parameterId,
          productId: cartItem?.singleProductId,
        })
      );

      setCombinationData(singleProductCombinations);
    }
  }, [dispatch, cartId, cartItem]);

  useEffect(() => {
    if (
      userdetails &&
      Object.keys(userdetails)?.length > 0 &&
      productDetails?._id
    ) {
      Promise.all([
        dispatch(
          getCartSingleProduct({
            id: userdetails?._id,
            productId: productDetails?._id,
          })
        ),
        dispatch(
          getWishlistProductById({
            id: productDetails?._id,
            searchProduct: "singleProductId",
          })
        ),
      ]);
    }
  }, [dispatch, userdetails, productDetails?._id]);

  useEffect(() => {
    if (isWishlist && isArchitect) {
      dispatch(getSingleProductByWishlistId({ id: isWishlist }));
    }
  }, [dispatch, isWishlist, isArchitect]);

  useEffect(() => {
    if (
      cartSingleLoading === "fulfilled" &&
      cartSingleProduct &&
      userdetails &&
      Object.keys(userdetails)?.length > 0
    ) {
      setCartProductIds(cartSingleProduct);
    } else if (
      cartdata &&
      userdetails &&
      Object.keys(userdetails)?.length === 0
    ) {
      const updatedCart = [...cartdata];

      const filteredData = updatedCart.filter(
        (product) => product?.singleProductId
      );
      setCartProductIds(filteredData);
    }
  }, [cartSingleLoading, cartSingleProduct, userdetails, cartdata]);

  useEffect(() => {
    if (addedCartProduct) {
      setCartProductIds((prevState) => [...prevState, addedCartProduct]);
    }
  }, [addedCartProduct]);

  useEffect(() => {
    if (
      isWishlist &&
      isArchitect &&
      wishlistLoading === "fulfilled" &&
      singleWishlistProduct &&
      singleWishlistProduct?.length > 0
    ) {
      const currentArchCombination =
        singleWishlistProduct[0]?.singleProductCombinations.map(
          (combination) => ({
            attributeId: combination?.attributeId,
            parameterId: combination?.parameterId,
            productId: singleWishlistProduct[0]?.singleProductId,
          })
        );
      setCombinationData(currentArchCombination);
    }
  }, [wishlistLoading, singleWishlistProduct, isWishlist, isArchitect]);

  useEffect(() => {
    if (
      userdetails &&
      Object.keys(userdetails)?.length > 0 &&
      wishlistProductDetails &&
      wishlistLoading === "fulfilled"
    ) {
      // console.log("wishlistProductDetails", wishlistProductDetails);
      const currentWishlist = wishlistProductDetails.find(
        (data) => data?._id === isWishlist
      );

      // console.log("currentWishlist", currentWishlist);

      if (currentWishlist) {
        const currentCombination =
          currentWishlist?.singleProductCombinations.map((combination) => ({
            attributeId: combination?.attributeId,
            parameterId: combination?.parameterId,
            productId: currentWishlist?.singleProductId,
          }));

        if (!isArchitect) {
          setCombinationData(currentCombination);
        }
        setWishlistProducts([currentWishlist]);
      } else {
        setWishlistProducts(wishlistProductDetails);
      }
    } else if (whishlistdata && Object.keys(userdetails)?.length === 0) {
      let currentWishlist = undefined;

      if (whishlistdata?.length > 0) {
        currentWishlist = whishlistdata?.find(
          (data) => data?._id?.toString() === isWishlist?.toString()
        );
      }

      if (currentWishlist) {
        const currentCombination =
          currentWishlist?.singleProductCombinations.map((combination) => ({
            attributeId: combination?.attributeId,
            parameterId: combination?.parameterId,
            productId: currentWishlist?.singleProductId,
          }));

        if (!isArchitect) {
          setCombinationData(currentCombination);
        }

        setWishlistProducts([currentWishlist]);
      } else {
        setWishlistProducts(whishlistdata);
      }
    } else {
      setWishlistProducts([]);
    }
  }, [
    userdetails,
    wishlistProductDetails,
    wishlistLoading,
    whishlistdata,
    isWishlist,
    isArchitect,
  ]);

  useEffect(() => {
    if (productDetails?._id) {
      dispatch(fetchdotProductDetailsByProductId(productDetails?._id));
    }
  }, [dispatch, productDetails?._id]);

  /** get all root collections */
  useEffect(() => {
    const getAllRootCollections = async () => {
      try {
        const { data } = await axiosInstance.get(
          "/api/collection/getRootCollection"
        );

        if (data?.success) {
          setRootCollection(data?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllRootCollections();
  }, []);

  useEffect(() => {
    if (
      defaultProductCombination &&
      !isWishlist &&
      !rfpId &&
      !cartId &&
      !orderItemId &&
      !orderId &&
      !productType
    ) {
      setSelectedCombination(defaultProductCombination);

      const currentCombination = defaultProductCombination?.combinations.map(
        (combination) => ({
          attributeId: combination?.attributeId?._id,
          parameterId: combination?.parameterId?._id,
          productId: defaultProductCombination?.singleProductId?._id,
        })
      );
      setCombinationData(currentCombination);
    }
  }, [
    defaultProductCombination,
    isWishlist,
    rfpId,
    cartId,
    orderItemId,
    orderId,
    productType,
  ]);

  const getData = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `api/single-product-combination/combination?search=${JSON.stringify(
          combinationData
        )}`
      );

      // console.log("combinationData", combinationData);

      if (data.data.length > 0) {
        const currentCombination = data.data[0];
        setSelectedCombination(currentCombination);
        setOpen(false);
        return;
      }

      toastSuceess("Currently this varient is unavailable!");
      // setLoading(false);
    } catch (error) {
      toastSuceess(error?.response?.data?.message);
      // setLoading(false);
    }
  }, [combinationData]);

  useEffect(() => {
    if (combinationData.length > 0) {
      getData();
    }
  }, [getData, combinationData.length]);

  const handleAddToWishlist = async (combination) => {
    try {
      const currentCombination = combination?.combinations?.map((item) => ({
        attributeId: item.attributeId._id,
        parameterId: item.parameterId._id,
      }));

      const productData = {
        singleProductId: combination?.singleProductId?._id,
        singleProductCombinations: currentCombination,
      };

      if (Object.keys(userdetails)?.length > 0) {
        await dispatch(addToWishlist(productData)).unwrap();
        await dispatch(
          getWishlistProductById({
            id: productDetails?._id,
            searchProduct: "singleProductId",
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
      if (Object.keys(userdetails)?.length > 0) {
        await dispatch(removeFromWishlist(id)).unwrap();
        await dispatch(
          getWishlistProductById({
            id: productDetails?._id,
            searchProduct: "singleProductId",
          })
        ).unwrap();
      } else {
        dispatch(removeToWhislist(id)); // remove from local storage
      }

      if (isWishlist && !isArchitect) {
        const currentUrl = window.location.href;
        const urlWithoutQuery = currentUrl.split("?")[0];
        window.history.replaceState({}, document.title, urlWithoutQuery);
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

  const fetchAllParameterByAttributeId = (id) => {
    dispatch(getAllSingleProductParameterByAttributeId(id));
  };

  const handleClicked = () => {
    setShowRaiseAQueryModal(true);
  };

  // for wishlist
  useEffect(() => {
    if (
      wishlistProducts &&
      selectedCombination?.combinations &&
      Object.keys(userdetails).length > 0
    ) {
      const currentCombination = selectedCombination?.combinations?.map(
        (item) => ({
          attributeId: item.attributeId._id,
          parameterId: item.parameterId._id,
        })
      );

      const productData = {
        singleProductId: selectedCombination?.singleProductId?._id,
        singleProductCombinations: currentCombination,
      };

      const data = isSingleProductInWishlist(wishlistProducts, productData);

      // console.log("wishlistProducts", wishlistProducts);
      // console.log("data", data);

      setIsWishlistProducts(data);
    } else if (
      whishlistdata &&
      selectedCombination &&
      selectedCombination?.combinations &&
      Object.keys(userdetails).length === 0
    ) {
      const currentCombination = selectedCombination?.combinations?.map(
        (item) => ({
          attributeId: item.attributeId._id,
          parameterId: item.parameterId._id,
        })
      );

      const productData = {
        singleProductId: selectedCombination?.singleProductId?._id,
        singleProductCombinations: currentCombination,
      };

      const data = isSingleProductInWishlist(whishlistdata, productData);

      setIsWishlistProducts(data);
    } else {
      setIsWishlistProducts(null);
    }
  }, [wishlistProducts, selectedCombination, userdetails, whishlistdata]);

  // for cart
  useEffect(() => {
    if (cartProductIds && selectedCombination?.combinations) {
      const currentCombination = selectedCombination?.combinations?.map(
        (item) => ({
          attributeId: item.attributeId._id,
          parameterId: item.parameterId._id,
        })
      );

      const productData = {
        singleProductId: selectedCombination?.singleProductId?._id,
        singleProductCombinations: currentCombination,
      };

      const data = isSingleProductInWishlist(cartProductIds, productData);
      if (data) {
        setStatus("added");
        setCartProductQuantity(data?.quantity);
        setCartProduct(data);
      } else {
        setStatus("removed");
        setCartProductQuantity(1);
        setCartProduct(null);
      }
    }

    // else if (
    //   cartProductIds &&
    //   selectedCombination &&
    //   selectedCombination?.combinations &&
    //   Object.keys(userdetails).length === 0
    // ) {

    // const currentCombination = selectedCombination?.combinations?.map(
    //   (item) => ({
    //     attributeId: item.attributeId._id,
    //     parameterId: item.parameterId._id,
    //   })
    // );

    // const productData = {
    //   singleProductId: selectedCombination?.singleProductId?._id,
    //   singleProductCombinations: currentCombination,
    // };

    // const data = isSingleProductInWishlist(cartProductIds, productData);
    // if (data) {
    //   setStatus("added");
    //   setCartProductQuantity(data?.quantity);
    //   setCartProduct(data);
    // }

    // }
    else {
      setCartProduct(null);
    }
  }, [cartProductIds, selectedCombination, userdetails, cartdata]);

  useEffect(() => {
    if (singleProdParameters.length > 0 && parameterLoading === "fulfilled") {
      setOpen(true);
    }
  }, [singleProdParameters, parameterLoading]);

  const getProductDescriptions = useCallback(async () => {
    try {
      if (productDetails?._id) {
        const { data } = await axiosInstance.get(
          `/api/ProductDescriptions/getProductDescriptions/${productDetails?._id}`
        );

        if (data?.success) {
          setDescriptionsData(data.data);
          if (data?.succcess) {
            setDescriptionsData(data.data);
          }
        }
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }, [productDetails?._id]);

  const getreview = useCallback(async () => {
    try {
      if (!productDetails?._id) {
        return setreviewdata([]);
      }
      const { data } = await axiosInstance.get(
        `/api/review?Product=${productDetails?._id}?model=${model}`
      );
      setreviewdata(data.data);
    } catch (error) {
      alert(error?.response?.data?.message);
    }
  }, [productDetails?._id]);

  const getProductByProducTtag = useCallback(
    async (producttags) => {
      try {
        const filteredtag = producttags.map((p) => p?._id);

        const { data } = await axiosInstance.post(
          "/api/product-new/product-tag",
          {
            tags: filteredtag,
          }
        );

        setproductdata(
          data?.data.filter((p) => p?._id !== defaultProductCombination?._id)
        );
      } catch (error) {
        toastError(error?.response?.data?.message);
      }
    },
    [defaultProductCombination?._id]
  );

  useEffect(() => {
    if (
      loading === "fulfilled" &&
      productdetails &&
      Object.keys(productdetails).length > 0
    ) {
      setProductDetails(productdetails);
      setBreadcrumbs(productdetails?.Collection ?? {});
      getProductByProducTtag(productdetails.tags);
      getreview();
      getProductDescriptions();
      window.scrollTo(0, 0);
    }
  }, [
    loading,
    productdetails,
    getProductByProducTtag,
    getreview,
    getProductDescriptions,
  ]);

  //Varient Working
  //Varient SameasFront
  //Show Modal

  const [show, setshow] = useState(false);
  const [showShareModal, setshowShareModal] = useState(false);

  const handleClose = () => {
    setshow(false);
  };
  const ShareModalClose = () => {
    setshowShareModal(false);
  };

  const RaiseModalClose = () => {
    setShowRaiseAQueryModal(false);
  };

  const debouncedDispatch = debounce((id, newQuantity) => {
    dispatch(
      updateCartProductQuantity({
        id,
        productData: { quantity: newQuantity },
      })
    );
  }, 500);

  // const [varientproductdetails, setvarientproductdetails] = useState({});
  const [varientproductdetails] = useState({});

  const handleQuantity = (value) => {
    const newQuantity = Math.max(1, cartProductQuantity + value);

    if (status === "removed") {
      setCartProductQuantity(newQuantity);
    } else if (status === "added") {
      setCartProductQuantity(newQuantity);
      debouncedDispatch(cartProduct._id, newQuantity);
    }
  };

  const handleAddTocart = async (combination) => {
    try {
      setStatus("adding");
      const currentCombination = combination?.combinations?.map((item) => ({
        attributeId: item.attributeId._id,
        parameterId: item.parameterId._id,
      }));

      const productData = {
        singleProductId: combination?.singleProductId?._id,
        singleProductCombinations: currentCombination,
        quantity: cartProductQuantity,
        archId: isArchitect,
      };

      if (userdetails && Object.keys(userdetails)?.length > 0) {
        await dispatch(addToCart(productData)).unwrap();
        setStatus("added");
      } else {
        dispatch(
          addTocart({
            _id: Date.now(),
            quantity: cartProductQuantity,
            ...productData,
          })
        ); // saving in local storage
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

  // const toggleCart = () => {
  //   setmanagecart(!managecart);
  // };

  const [pdfbackattributeItem] = useState();

  const getTotalRating = useCallback(async () => {
    if (!productDetails?._id) {
      return null;
    }
    try {
      const { data } = await axiosInstance.get(
        `/api/review/product/totalRating/${productDetails._id}?model=${model}`,
        {
          headers: {
            Auth: localStorage.getItem("token"),
          },
        }
      );

      setUserRatingData(data.data);
    } catch (error) {
      console.log(error, "check error");
    }
  }, [productDetails?._id]);

  useMemo(() => {
    getTotalRating();
  }, [getTotalRating]);

  if (loading === "pending") {
    return <Preloader />;
  }

  return (
    <>
      {/* Quotation Show */}

      <SnackbarMessage setState={setState} state={state} />

      <RaiseAQuery
        showRaiseAQueryModal={ShowRaiseAQueryModal}
        RaiseModalClose={RaiseModalClose}
        product={productDetails}
        architectId={isArchitect}
        productCombination={(function () {
          const currentCombination = selectedCombination?.combinations?.map(
            (item) => ({
              attributeId: item.attributeId._id,
              parameterId: item.parameterId._id,
            })
          );
          return {
            singleProductId: selectedCombination?.singleProductId?._id,
            singleProductCombinations: currentCombination,
          };
        })()}
      />

      <ShareProduct
        ProductName={productDetails?.ProductName}
        showShareModal={showShareModal}
        ShareModalClose={ShareModalClose}
      />

      {singleProdParameters && singleProdParameters?.length > 0 && (
        <ParameterModel
          parameters={singleProdParameters}
          setOpen={setOpen}
          open={open}
          combinationData={combinationData}
          selectedParameter={selectedParameter}
          setCombinationData={setCombinationData}
        />
      )}

      {/* Seo TItle Desc */}

      <Helmet>
        <meta charset="UTF-8" />
        <title>{productDetails?.ProductName}</title>
        <meta name="description" content={productDetails?.SeoMetaDesc} />
        <meta name="keywords" content={productDetails?.SeoProductTitle} />
      </Helmet>

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
            marginTop: "200px",
            fontSize: "30px",
            textTransform: "uppercase",
          }}
        >
          Single Product Details
        </h3> */}
      </div>
      {/* Open Cart Sidebar */}
      {/* {managecart && <CartSidebar toggleCart={toggleCart} />} */}

      {/* product details with image */}

      <p
        style={{
          paddingLeft: "12px",
          paddingTop: "20px",
          textAlign: "left",
          color: "#324040",
        }}
      >
        <HomeIcon /> &nbsp;
        <NavigateNextIcon />
        &nbsp;
        <Link
          to={`/collection/${collectionurl}`}
          style={{ fontSize: 16, color: "#324040" }}
        >
          {collectionurl}
        </Link>{" "}
        <Link
          to={`/collection/${Breadcrumbs.url}`}
          style={{ fontSize: 16, color: "#324040" }}
        >
          {Breadcrumbs?.title}
        </Link>
        &nbsp;
        <NavigateNextIcon />
        &nbsp;
        <Link style={{ fontSize: 16, color: "#324040" }}>
          {productname}
        </Link>{" "}
      </p>

      <div
        className="row mobileproductdetailsTopdiv"
        style={{ padding: "0px 0px 0px 13px" }}
      >
        <br />
        <div className="col-lg-9 col-12">
          <div className="row" style={{ paddingTop: "20px" }}>
            {selectedCombination && productDetails && (
              <RoomSliderCusProd
                productImages={[
                  selectedCombination?.image,
                  ...(productDetails?.ProductImage || []),
                ]}
              />
            )}
          </div>
        </div>

        <div className="col-lg-3 CustomizedProductNameSection12 CutomizedProductaddqtystyle1">
          <div className="row">
            <h4
              style={{
                color: "#324040",
                fontSize: "20px",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              {productDetails?.ProductName}
            </h4>
            <div
              className="col-lg-8 RatingDivWidthStyle12"
              style={{ float: "left" }}
            >
              <Rating
                totalRating={UserRatingData.totalRating}
                totalUser={UserRatingData.totalUser}
                ratingData={UserRatingData.ratingData}
                productdetails={productDetails}
                setUserRatingData={setUserRatingData}
                model={model}
                getTotalRating={getTotalRating}
              />
            </div>
            <div
              className="col-lg-4 RatingDivWidthStyle34"
              style={{ float: "left" }}
            >
              {isWishlistProducts ? (
                <IconButton
                  color="primary"
                  aria-label="dislike"
                  style={{
                    // position: "absolute",
                    // top: "10px",
                    // right: "10px",
                    zIndex: 2,
                  }}
                  onClick={() =>
                    handleRemoveToWishlist(isWishlistProducts?._id)
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
                    marginTop: "7px",
                    zIndex: 2,
                  }}
                  onClick={() => handleAddToWishlist(selectedCombination)}
                >
                  <AiTwotoneHeart size={22} />
                </IconButton>
              )}
              <div
                style={{ float: "left" }}
                className="shareOpen"
                onClick={() => {
                  setshowShareModal(true);
                }}
              >
                <ShareIcon style={{ fontSize: "14px" }} />
              </div>
            </div>
          </div>
          {/* <br></br> */}
          {/* Productdetails Attribute */}
          {/* <br></br> */}
          {/* Product Customized Price */}
          <div className="row">
            {userdetails &&
            userdetails.userRole?.find((role) => role?.name === "Architect") ? (
              <>
                <h4 style={{ color: "#324040", marginTop: "10px" }}>
                  ₹{" "}
                  {FinialAmount(selectedCombination?.SalePrice, productDetails)}
                  &nbsp;&nbsp;
                  <strike style={{ fontSize: 14, color: "#D03727" }}>
                    ₹ {FinialAmount(selectedCombination?.MRP, productDetails)}
                  </strike>{" "}
                </h4>
                <h2
                  style={{
                    fontSize: 16,
                    textAlign: "left",
                    padding: "10px 10px 0px 10px",
                    color: "#bbb",
                    fontWeight: 500,
                  }}
                >
                  You Save ₹{" "}
                  {FinialAmount(selectedCombination?.MRP, productDetails) -
                    FinialAmount(
                      selectedCombination?.SalePrice,
                      productDetails
                    )}{" "}
                  (
                  {(
                    100 -
                    (Number(selectedCombination?.SalePrice) /
                      Number(selectedCombination?.MRP)) *
                      100
                  ).toFixed(2)}
                  %)
                </h2>
              </>
            ) : productDetails?.RequestForPrice ? (
              <center>
                <button
                  className="badge btn-default Request-for-Price-btn p-3"
                  type="button"
                  onClick={() => handleClicked()}
                  style={{
                    width: "80%",
                    textTransform: "uppercase",
                    backgroundColor: "#A08862",
                  }}
                >
                  Get Price
                </button>
                <button
                  className="badge btn-default Request-for-Price-btn p-3"
                  type="button"
                  style={{
                    width: "80%",
                    textTransform: "uppercase",
                    marginTop: "10px",
                  }}
                  onClick={() => {
                    window.open(
                      "https://api.whatsapp.com/send?phone=875599395",
                      "_blank"
                    );
                  }}
                >
                  Talk With a Designer
                </button>
              </center>
            ) : (
              <>
                <br></br>
                <br></br>
                <br></br>
                <h4 style={{ color: "#324040", marginTop: "10px" }}>
                  ₹{" "}
                  {FinialAmount(selectedCombination?.SalePrice, productDetails)}
                  &nbsp;&nbsp;
                  <strike style={{ fontSize: 14, color: "#D03727" }}>
                    ₹ {FinialAmount(selectedCombination?.MRP, productDetails)}
                  </strike>{" "}
                </h4>
                <h2
                  style={{
                    fontSize: 16,
                    textAlign: "left",
                    padding: "10px 10px 0px 10px",
                    color: "#bbb",
                    fontWeight: 500,
                  }}
                >
                  Save ₹{" "}
                  {FinialAmount(selectedCombination?.MRP, productDetails) -
                    FinialAmount(
                      selectedCombination?.SalePrice,
                      productDetails
                    )}{" "}
                  (
                  {(
                    100 -
                    (Number(selectedCombination?.SalePrice) /
                      Number(selectedCombination?.MRP)) *
                      100
                  ).toFixed(2)}
                  %)
                </h2>
              </>
            )}
          </div>

          {productDetails?.SellingType === "Installment" && (
            <>
              <br></br>

              {/* input box to change price */}
              <div className="row mt-2">
                <div className="col-md-8">
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={buyingType}
                    onChange={(e) => setbuyingType(e.target.value)}
                  >
                    <option disabled>Choose Buying Type</option>
                    <option value="Normal">Normal</option>
                    <option value="Installment">Installment</option>
                  </select>
                </div>
              </div>
              <br></br>
              {buyingType === "Installment" && (
                <div id="accordion">
                  <div className="card">
                    <div
                      className="card-header"
                      id="headingOne"
                      style={{ backgroundColor: "#475B52" }}
                    >
                      <h5 className="mb-0">
                        <button
                          className="btn btn-link"
                          data-toggle="collapse"
                          data-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                          style={{ textDecoration: "none", color: "#fff" }}
                        >
                          {/* Installment Price */}
                          Buy on Installment
                        </button>
                      </h5>
                    </div>
                    <div
                      id="collapseOne"
                      className="collapse show"
                      aria-labelledby="headingOne"
                      data-parent="#accordion"
                    >
                      <div className="card-body">
                        {selectedCombination?.singleProductId?.Installment &&
                          selectedCombination?.singleProductId?.Installment.map(
                            (p, i) => (
                              <p key={p._id}>
                                {i === 0 ? (
                                  <>
                                    <i className="fa fa-check-square-o"></i>{" "}
                                    {p.Name} - ₹{" "}
                                    {getPercentage(
                                      FinialAmount(
                                        selectedCombination?.SalePrice,
                                        selectedCombination
                                      ),
                                      p.Amount
                                    )}{" "}
                                  </>
                                ) : (
                                  <>
                                    <i className="fa fa-square-o"></i> {p.Name}{" "}
                                    - ₹{" "}
                                    {getPercentage(
                                      FinialAmount(
                                        selectedCombination?.SalePrice,
                                        selectedCombination
                                      ),
                                      p.Amount
                                    )}
                                  </>
                                )}
                              </p>
                            )
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="col-lg-12 mt-2">
            <center>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th style={{ backgroundColor: "#475B52", color: "#fff" }}>
                      Attribute
                    </th>
                    <th
                      style={{
                        backgroundColor: "#475B52",
                        color: "#fff",
                      }}
                    >
                      Current Selection
                    </th>
                    <th
                      style={{
                        backgroundColor: "#475B52",
                        color: "#fff",
                      }}
                    >
                      Visuals
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        backgroundColor: "#475B52",
                        color: "#fff",
                      }}
                    >
                      Customize
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCombination?.combinations?.map(
                    (combination, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <b>{combination?.attributeId?.PrintName}</b>
                          </td>
                          <td>
                            <b>{combination?.parameterId?.name}</b>
                          </td>
                          <td>
                            <img
                              src={`${REACT_APP_URL}/images/parameter/${combination?.parameterId?.profileImage}`}
                              alt="Preview"
                              style={{
                                // padding: "4px",
                                width: "70px",
                                height: "70px",
                                cursor: "pointer",
                              }}
                              // onClick={() => {
                              //   fetchAllParameterByAttributeId(
                              //     combination?.attributeId?._id
                              //   );
                              //   setSelectedParameter(
                              //     combination?.parameterId?._id
                              //   );
                              // }}
                            />
                          </td>
                          <td>
                            <center>
                              <div
                                onClick={() => {
                                  fetchAllParameterByAttributeId(
                                    combination?.attributeId?._id
                                  );
                                  setSelectedParameter(
                                    combination?.parameterId
                                  );
                                }}
                                style={{
                                  backgroundColor: "#475B52",
                                  padding: "5px 10px",
                                  color: "#fff",
                                  fontSize: "0.8rem",
                                  // zoom: "70%",
                                  cursor: "pointer",
                                }}
                              >
                                Customize
                              </div>
                            </center>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </center>
          </div>

          {/* Quantity handle */}
          {selectedCombination?.ProductInStockQuantity ? (
            <div className="row" style={{ marginTop: 20 }}>
              {userdetails &&
              userdetails.userRole?.find(
                (role) => role?.name === "Architect"
              ) ? (
                <>
                  <div
                    className="col-lg-6 Section3Style"
                    // style={{ zoom: "80%" }}
                  >
                    <div className="input-group ProductDetailAddtocartStyle">
                      <span className="input-group-btn">
                        <button
                          type="button"
                          className="btn btn-default"
                          style={{ backgroundColor: "#A08862" }}
                          data-field=""
                          onClick={() => {
                            handleQuantity(-1);
                          }}
                        >
                          <RemoveIcon style={{ color: "#fff" }} />
                        </button>
                      </span>
                      &nbsp;
                      <input
                        style={{ textAlign: "center", width: "30px" }}
                        type="text"
                        id="quantity"
                        name="quantity"
                        className="form-control input-number"
                        value={cartProductQuantity || 1}
                        min={1}
                        max={100}
                        disabled
                      />
                      &nbsp;
                      <span className="input-group-btn">
                        <button
                          type="button"
                          className="btn btn-default"
                          style={{ backgroundColor: "#A08862" }}
                          data-field=""
                          onClick={() => {
                            handleQuantity(1);
                          }}
                        >
                          <AddIcon style={{ color: "#fff" }} />
                        </button>
                      </span>
                    </div>
                  </div>

                  <div className="col-lg-1 Section3Style">&nbsp;</div>
                  <div
                    className="col-lg-4 Section3Style"
                    // style={{ zoom: "80%" }}
                  >
                    <AddToCartButton
                      onClick={() => {
                        if (!cartProduct) {
                          handleAddTocart(selectedCombination);
                        } else {
                          navigate("/cart");
                        }
                      }}
                      status={status}
                    />
                    {/* <button
                    type="button"
                    className="button"
                    style={{
                      width: "60%",
                      textTransform: "uppercase",
                      backgroundColor: "#475B52",
                      borderRadius: "5px",
                    }}
                    onClick={() => {
                      handleAddTocart(
                        productDetails?.ProductName,
                        productDetails?.OriginalPrice,
                        productDetails?._id,
                        productDetails?.ProductImage[0],
                        productDetails?.GSTIN
                      );
                    }}
                  >
                    Add To Cart
                  </button> */}
                  </div>
                </>
              ) : (
                !productDetails?.RequestForPrice && (
                  <center>
                    <div className="col-lg-12 Section3Style">
                      <div className="input-group ProductDetailAddtocartStyle">
                        <span className="input-group-btn">
                          <button
                            type="button"
                            className="btn btn-default"
                            style={{ backgroundColor: "#A08862" }}
                            data-field=""
                            onClick={() => {
                              handleQuantity(-1);
                            }}
                          >
                            <RemoveIcon style={{ color: "#fff" }} />
                          </button>
                        </span>
                        &nbsp;
                        <input
                          style={{ textAlign: "center", width: "30px" }}
                          type="text"
                          id="quantity"
                          name="quantity"
                          className="form-control input-number"
                          value={cartProductQuantity || 1}
                          min={1}
                          max={100}
                          disabled
                        />
                        &nbsp;
                        <span className="input-group-btn">
                          <button
                            type="button"
                            className="btn btn-default"
                            style={{ backgroundColor: "#A08862" }}
                            data-field=""
                            onClick={() => {
                              handleQuantity(1);
                            }}
                          >
                            <AddIcon style={{ color: "#fff" }} />
                          </button>
                        </span>
                      </div>
                    </div>

                    <div className="col-lg-12 Section3Style">
                      <AddToCartButton
                        onClick={() => {
                          if (!cartProduct) {
                            handleAddTocart(selectedCombination);
                          } else {
                            navigate("/cart");
                          }
                        }}
                        status={status}
                      />
                    </div>
                  </center>
                )
              )}
            </div>
          ) : (
            <h4
              style={{ color: "red", textAlign: "center", margin: "10px, 0px" }}
              className="blink"
            >
              Out of Stock
            </h4>
          )}

          {/* Quotation Creation */}
          <Modal
            handleClose={handleClose}
            show={show}
            width="90%"
            height="88vh"
            // style={{overflowY:"scroll"}}
            overflow={"scroll"}
          >
            {productDetails && (
              <>
                <ProductPdfComponents
                  ref={componentRef}
                  productdetails={productDetails}
                  // varientset={varientset}
                  varientproductdetails={varientproductdetails}
                  quantity={cartProductQuantity}
                  handleClose={handleClose}
                  //PAss Total Customized Price
                  // customizedProductPrice={calculateTotalCustomizedProduct}
                  //Pass customized product data
                  backattributeItem={pdfbackattributeItem}
                  //Pass Customized Product In Reac
                />
              </>
            )}
          </Modal>
          <center>
            <button
              className="HideInPhone badge btn-default Request-for-Price-btn p-3"
              type="button"
              style={{
                width: "80%",
                textTransform: "uppercase",
                marginTop: "10px",
              }}
              onClick={() => setshow(true)}
            >
              PREVIEW QUOTATION
            </button>
          </center>
          <br></br>
          <br></br>
        </div>
        <div className="container-fluid CustomizedProductDescription">
          <h3 style={{ textTransform: "uppercase" }}>Product Description</h3>
          <br />
          <p
            style={{
              fontSize: "18px",
              letterSpacing: "1px",
              textAlign: "justify",
            }}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: productDetails?.ProductDescription,
              }}
              className="productdescription"
            ></span>
          </p>
          <div id="accordion">
            <div className="accordion accordion-flush " id="faqlist">
              {DescriptionsData.map((p, index) => (
                <Accrodianitem p={p} index={index} key={p._id} />
              ))}
            </div>
          </div>
        </div>
        {allDotproducts && allDotproducts.length > 0 && (
          <div className="row SingleProductPageFeelathomestyle">
            <p
              style={{
                color: "#818181",
                textAlign: "center",
                letterSpacing: "2px",
              }}
            >
              Dot Product
            </p>
            <h1
              style={{ textAlign: "center", textTransform: "uppercase" }}
              // className="mb-5"
            >
              Feel at Home
            </h1>
            <br></br>
            <br></br>
            <br></br>
            <div
              id="carouselExampleAutoplaying"
              className="carousel carousel-dark slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {
                  allDotproducts.map((p, index) => (
                    <DotCusProductcard
                      key={p._id}
                      product={p}
                      index={index}
                      total={allDotproducts.length}
                    />
                  ))
                  // <>
                  //   <br></br>
                  //   <center>
                  //     <p className="feelathomeerror">
                  //       This Product Does Not Have Any Dot Product.
                  //     </p>
                  //   </center>
                  // </>
                }
              </div>
            </div>
          </div>
        )}

        {contactUs.contactUsVideo &&
          Object.keys(contactUs).length > 0 &&
          Object.keys(contactUs.contactUsVideo).length > 0 && (
            <div className="row feelfreetocontactusstyle feelfreetocontactusstyle1">
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: "-2",
                  background:
                    "linear-gradient(rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.5))",
                }}
              ></div>
              <video
                className="background-video feelfreetocontactusVideo"
                autoPlay
                loop
                muted
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: "-3",
                }}
              >
                <source
                  src={`${REACT_APP_URL}/images/clientImages/${contactUs.contactUsVideo?.pwusImage}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

              <div
                className="parallel-image-section feelfreetocontactusstyle2"
                style={{ paddingTop: "50px" }}
              >
                <div className="content">
                  <center>
                    <h1
                      className="feelfreetocontactusheadingstyle feelfreecontentstyle"
                      style={{
                        color: "#fff",
                        textTransform: "uppercase",
                        fontWeight: "600",
                      }}
                    >
                      Feel Free to contact us
                    </h1>
                    <p
                      className="feelfreecontentstyle"
                      style={{ color: "#fff", fontSize: "18px" }}
                    >
                      Feel free to reach out to us for all your home decor
                      needs. We're here to assist you in turning your dreams
                      into reality.
                    </p>
                    <br></br>
                    <div className="col-lg-2" style={{ float: "left" }}>
                      &nbsp;
                    </div>
                    <div
                      className="col-lg-8 Section3Style22"
                      style={{ float: "left" }}
                    >
                      <FeelFreeToContactUs />
                    </div>
                    <div className="col-lg-2" style={{ float: "left" }}>
                      &nbsp;
                    </div>
                  </center>
                </div>
              </div>
            </div>
          )}

        <div className="row" style={{ marginTop: "30px", paddingRight: "0px" }}>
          <p
            style={{
              color: "#818181",
              textAlign: "center",
              letterSpacing: "2px",
            }}
          >
            All Products
          </p>
          <h2
            style={{ textAlign: "center", textTransform: "uppercase" }}
            // className="mb-5"
          >
            EXPLORE ALL PRODUCTS
          </h2>

          {rootCollection &&
            rootCollection?.length > 0 &&
            rootCollection.slice(0, 6)?.map((collection) => (
              <div className="col-lg-2" style={{ padding: "15px" }}>
                <Link
                  to={`/collection/${collection.url}`}
                  className="sub-channel-info"
                >
                  <center>
                    <div
                      className="col-lg-12 exploreallproductsstyle"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.5)), url(${`${REACT_APP_URL}/images/collection/${collection?.CollectionImage[0]}`})`,
                      }}
                    ></div>
                    <p className="exploreallproductstyleheading exploreallproductstyleheadingColor">
                      {collection.title}
                    </p>
                  </center>
                </Link>
              </div>
            ))}
        </div>

        {/* <div
          className="row ShippingStyle"
          style={{ margin: "50px 0px 50px 0px" }}
        >
          <div className="container">
            <div className="col-lg-5" style={{ float: "left" }}>
              <h4>Shipping &amp; Returns</h4>
              <hr />
              <br />
              <h6 style={{ fontWeight: 800 }}>Free Shipping Service</h6>
              <p>
                Free shipping is available in most of the mainland. Shipping
                surcharge applies to remote areas of your country.
              </p>
              <br />
              <h6 style={{ fontWeight: 800 }}>When Will My Order Ship</h6>
              <p>
                We usually ship all orders within 1-2 business day. The
                Estimated Delivery Time is subject to the instructions on each
                product page.
              </p>
              <br />
              <h6 style={{ fontWeight: 800 }}>
                30 Day Return &amp; Exchange Policy
              </h6>
              <p>
                We offer returns for most items within 30 days of delivery
                whenever you are not satisfied with the product or change your
                mind.
              </p>
            </div>
            <div className="col-lg-1" style={{ float: "left" }}>
              &nbsp;
            </div>
            <div className="col-lg-6" style={{ float: "left" }}>
              <div id="accordion" style={{ marginTop: "20px" }}>
                <div className="accordion accordion-flush " id="faqlist">
                  {DescriptionsData.map((p, index) => (
                    <Accrodianitem p={p} index={index} key={p._id} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* {reviewdata && reviewdata?.length !== 0 && (
          <ClientTestimonial reviewdata={reviewdata} />
        )} */}

        {/* TESTIMONIALS */}

        {/* {productdata && productdata.length > 0 && (
          <>
            <section className="testimonials">
              <div className="container">
                <div className="text-center mx-auto" style={{ maxWidth: 500 }}>
                  <h1
                    style={{ textAlign: "center", textTransform: "uppercase" }}
                  >
                    Similar Products
                  </h1>
                  <p style={{ color: "#818181", textAlign: "center" }}>
                    Customers Also Viewed
                  </p>
                  <br />
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <div id="customers-testimonials1" className="owl-carousel">
                      <Carousel
                        responsive={responsive}
                        itemClass="px-3"
                        infinite={true}
                        autoPlaySpeed={1000}
                      >
                        {productdata &&
                          productdata?.length > 0 &&
                          productdata?.map((p) => (
                            <ProductTestimonial
                              key={p._id}
                              item={p}
                              collectionurl={collectionurl}
                            />
                          ))}
                      </Carousel>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )} */}

        {/* END OF TESTIMONIALS */}
      </div>

      <MainFooter />
    </>
  );
};

export default ProductDetails;
