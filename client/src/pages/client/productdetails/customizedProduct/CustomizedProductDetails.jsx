import React, { useEffect, useState, useCallback } from "react";

import debounce from "lodash/debounce";

import { useLocation, useNavigate } from "react-router-dom";
import ShareIcon from "@mui/icons-material/Share";
// import SliderImg1 from "../../../../assets/Image/Slider11.jpg";
import SideBar from "../../../../components/sidebar/SideBar";
import Accrodianitem from "../Accrodianitem";
// import RoomCatalogueCusProd from "../../../client/roomideas/RoomCatalogueCusProd";
import RoomSliderCusProd from "../../../client/roomideas/RoomSliderCusProd";
import { useDispatch, useSelector } from "react-redux";
import "../../../../index.css";
import Preloader from "../../../../components/preloader/Preloader";
// import { Modal } from "@mui/material";
import MainHeader from "../../../../components/mainheader/MainHeaderNew";
import "./productdetails.css";
import { useParams, Link } from "react-router-dom";
// import CartSidebar from "../../../../components/CartSidebar/CartSidebar.jsx";
import { Helmet } from "react-helmet";
import ShareProduct from "../../../client/ShareProduct/ShareProduct";
import StickySidebar from "../../../../components/stickysidebar/StickySidebar";
// import HeaderImage from "../../../../assets/Image/Slider11.jpg";
import { REACT_APP_URL } from "../../../../config";
// import ClientTestimonial from "../../../../components/clienttestimonial/ClientTestimonial";
import { getPercentage } from "../../../../utils/usefullFunction";
import { axiosInstance } from "../../../../config";
import Rating from "../../../../components/Rating/showingRating/Rating";
import MainFooter from "../../../../components/mainfooter/MainFooter";
// import ProductCalculation from "./ProductCalculation";
import { getPrice } from "../../../../utils/varientimge/getPrice";
// import AttributeCombinations from "./AttributeCombinations";
import AttributeCombinations from "../../../../components/attributeCombinations/AttributeCombinations";
// import ProductCustomizedProduct from "./ProductCustomizeProduct";
import ProductCustomizedProduct from "../../../../components/productCustomizedProduct/ProductCustomizedProduct";
import { fetchCustomizeProductWithCombinationsByUrl } from "../../../../redux/slices/customizeProductSlice";
import { fetchdotProductDetailsByProductId } from "../../../../redux/slices/newDotCustomizedProductSlice";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import { toastError } from "../../../../utils/reactToastify";
// import CustomizedProductTestimonial from "./CustomizedProductTestimonial";
// import { getPriceForCollectionClient } from "../../../../utils/varientimge/getPrice";
import { CustomizedFinialAmount } from "../../../../utils/usefullFunction";
import RaiseAQuery from "../../RaiseAQuery/RaiseAQuery";
import {
  addToWhislist,
  removeToWhislist,
} from "../../../../redux/slices/wishlistSlice";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlistCustomizedProductsById,
  fetchCustomizedProductsWishlist,
  fetchWishlistCustomizedProductsByWishlistId,
} from "../../../../redux/slices/newWishlistSlice";

import {
  addToCart,
  getCartCustomizeProduct,
  fetchCustomizetProductCombinationById,
} from "../../../../redux/slices/newCartSlice";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
// import { RiExchangeFill } from "react-icons/ri";
import { AiTwotoneHeart } from "react-icons/ai";
// import { toastSuceess } from "../../../../utils/reactToastify";
import { FeelAtHomeProducts } from "./FeelAtHomeProducts.jsx";
import { roundNumber } from "../../../../utils/useFullFunctions/roundNumber";
import { isCustomizedProductDetailsInWishlist } from "../../../../utils/isInWishlist/isCustomizedProductDetails";
import SnackbarMessage from "../../../../utils/snakbar/SnackbarMessage";
import AddToCartButton from "../../../../UI/AddToCartButton";

import { Slide, Fade } from "@mui/material";
import { getRequestForPriceProductCombinations } from "../../../../redux/slices/raiseAQuerySlice";
import FeelFreeToContactUs from "../../home/FeelFreeToContactUs.jsx";
import { fetchOrderProductByOrderItemId } from "../../../../redux/slices/orderSlice.js";

import { updateCartProductQuantity } from "../../../../redux/slices/newCartSlice";

function SlideTransition(props) {
  return (
    <Slide {...props} direction="up" vertical="bottom" horizontal="center" />
  );
}

const sortCombinations = (combinations) => {
  if (combinations?.length > 0) {
    let sortedCombinations = [...combinations].sort(
      (a, b) => a.attributeId.Display_Index - b.attributeId.Display_Index
    );
    return sortedCombinations;
  }
};

const backselectedMap = {
  SAF: "customizedProductPriceSAF",
  CB: "customizedProductPriceCB",
  IB: "customizedProductPriceIB",
};

const CustomizedProductDetails = () => {
  const { product } = useSelector((state) => state.orders);
  const { collectionurl, productname } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const isWishlist = searchParams.get("isWishlist");
  const rfpId = searchParams.get("rfp_id");
  const cartId = searchParams.get("cartId");
  const isArchitect = searchParams.get("isArchitect");
  const productType = searchParams.get("productType");
  const orderId = searchParams.get("orderId");
  const orderItemId = searchParams.get("orderItemId");

  const {
    addedCartProduct,
    cartCustomizeProduct,
    cartCustomizeProductLoading,
    cartItem,
  } = useSelector((state) => state.newCartSlice);
  const model = "customizedProduct";
  const { whishlistdata } = useSelector((state) => state.whishlist);
  const { userdetails } = useSelector((state) => state.auth);
  const {
    wishlistProductDetails,
    customizedProductWishlist,
    customizedWishlistProduct,
    loading: wishlistLoading,
  } = useSelector((state) => state.wishlist);

  // const { pName, id } = useParams();
  const { loading, productCombinationDetails } = useSelector(
    (state) => state.customizeProduct
  );

  // const { allDotCustomizeproducts } = useSelector(
  //   (state) => state.newDotCustomization
  // );
  const { allDotCustomizeproducts } = useSelector(
    (state) => state.newDotCustomization
  );
  const { requestForPriceProductCombinations, loading: rfpLoading } =
    useSelector((state) => state.raiseQuery);

  const { cartdata } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCustomizeProductWithCombinationsByUrl(productname));
  }, [dispatch, productname]);

  const [DescriptionsData, setDescriptionsData] = useState([]);
  const [ShowRaiseAQueryModal, setShowRaiseAQueryModal] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [P_Width, setP_Width] = useState(0);
  const [P_Height, setP_Height] = useState(0);
  const [UOM, setUOM] = useState([]);
  const [reviewdata, setreviewdata] = useState([]);
  const [requestProducts, setRequestProducts] = useState({});
  const [productData, setProductData] = useState([]);
  const [buyingType, setbuyingType] = useState("Normal");

  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [isWishlistProducts, setIsWishlistProducts] = useState(null);

  const [status, setStatus] = useState("removed");
  const [cartProduct, setCartProduct] = useState(null);
  const [cartProductIds, setCartProductIds] = useState([]);
  const [cartProductQuantity, setCartProductQuantity] = useState(1);
  const [wishlistProductOfUser, setWishlistProductOfUser] = useState({});
  const [isNew, setIsNew] = useState(true);

  const [state, setState] = React.useState({
    open: false,
    Transition: Fade,
    type: "",
    message: "",
  });

  // all selected combinations are
  const [FrontCombination, setFrontCombination] = useState([]);
  const [SAFCombination, setSAFCombination] = useState([]);
  const [CBCombination, setCBCombination] = useState([]);
  const [IBCombination, setIBCombination] = useState([]);
  const [rootCollection, setRootCollection] = useState([]);

  const [customizedProductPrice, setcustomizedProductPrice] = useState({
    customizedProductPriceFront: 0,
    customizedProductPriceSAF: 0,
    customizedProductPriceCB: 0,
    customizedProductPriceIB: 0,
  });

  const [calculateTotalCustomizedProduct, setcalculateTotalCustomizedProduct] =
    useState();

  const [backselected, setbackselected] = useState("");
  const [showShareModal, setshowShareModal] = useState(false);
  // const [managecart, setmanagecart] = useState(false);
  // const [architectProduct, setArchitectProduct] = useState({});
  // const [showPrice, setShowPrice] = useState(false);

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
  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/CustomizedProductDetails`
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
  /**fetch contactUsImage && contactUsVideo */
  const [contactUs, setContactUs] = useState({});
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

  /**get cart item from the cart */
  useEffect(() => {
    if (cartId) {
      dispatch(fetchCustomizetProductCombinationById(cartId));
    }
  }, [dispatch, cartId]);
  /**set cart item  */
  useEffect(() => {
    if (
      cartId &&
      cartItem &&
      Object.keys(cartItem).length > 0 &&
      cartItem.updatedWishlist &&
      cartItem.updatedWishlist.length > 0 &&
      productCombinationDetails &&
      productCombinationDetails?.product?.length > 0
    ) {
      const cartProduct = cartItem.updatedWishlist[0];
      if (cartProduct && Object.keys(cartProduct).length === 0) {
        return;
      }
      const arrays = [
        "FrontCombinations",
        "SAFCombinations",
        "CBCombinations",
        "IBCombinations",
      ];
      const combinations = {};

      for (let array of arrays) {
        const arrayCombinations = [];

        for (let field of cartProduct[array]) {
          const data = {
            attributeId: field?.attributeId,
            combinations: [
              {
                attributeId: field?.attributeId,
                parameterId: {
                  ...field.parameterId,
                  attributeId: field?.attributeId?._id,
                },
                pngImage: field?.pngImage,
                positionId: field.positionId,
              },
            ],
            isShow: true,
            parameterId: field.parameterId?._id,
            positionId: field.positionId?._id,
            positionX: 0,
            positionY: 0,
          };
          arrayCombinations.push(data);
        }

        combinations[`${array}`] = arrayCombinations;
      }
      if (productCombinationDetails?.product?.length > 0) {
        setProductDetails(productCombinationDetails?.product[0]);
      }

      if (cartItem) {
        setFrontCombination(
          sortCombinations(combinations?.FrontCombinations) || []
        );

        setSAFCombination(
          sortCombinations(combinations?.SAFCombinations) || []
        );
        setCBCombination(sortCombinations(combinations?.CBCombinations) || []);
        setIBCombination(sortCombinations(combinations?.IBCombinations) || []);
        setUOM(productCombinationDetails?.UOM);
        // setting default height and width
        setP_Height(cartItem?.customizeProductHeight);
        setP_Width(cartItem?.customizeProductWidth);

        if (cartItem?.customizedProductBackSelected) {
          setbackselected(cartItem?.customizedProductBackSelected);
        }
      }
    }
  }, [dispatch, cartId, cartItem, productCombinationDetails]);
  /** all customized product order of users   */
  useEffect(() => {
    if (orderItemId && orderId && productType) {
      dispatch(
        fetchOrderProductByOrderItemId({ orderItemId, orderId, productType })
      );
    }
  }, [dispatch, orderItemId, orderId, productType]);

  useEffect(() => {
    if (
      loading === "fulfilled" &&
      product &&
      orderItemId &&
      orderId &&
      productType &&
      product.length > 0 &&
      product[0] &&
      productCombinationDetails?.product?.length > 0
    ) {
      const orderProduct = product[0];
      if (orderProduct && Object.keys(orderProduct).length === 0) {
        return;
      }
      const arrays = [
        "FrontCombinations",
        "SAFCombinations",
        "CBCombinations",
        "IBCombinations",
      ];
      const combinations = {};

      for (let array of arrays) {
        const arrayCombinations = [];

        for (let field of orderProduct[array]) {
          const data = {
            attributeId: field?.attributeId,
            combinations: [
              {
                attributeId: field?.attributeId,
                parameterId: {
                  ...field.parameterId,
                  attributeId: field?.attributeId?._id,
                },
                pngImage: field?.pngImage,
                positionId: field.positionId,
              },
            ],
            isShow: true,
            parameterId: field.parameterId?._id,
            positionId: field.positionId?._id,
            positionX: 0,
            positionY: 0,
          };
          arrayCombinations.push(data);
        }

        combinations[`${array}`] = arrayCombinations;
      }
      if (productCombinationDetails?.product?.length > 0) {
        setProductDetails(productCombinationDetails?.product[0]);
      }

      if (orderProduct) {
        setFrontCombination(
          sortCombinations(combinations?.FrontCombinations) || []
        );

        setSAFCombination(
          sortCombinations(combinations?.SAFCombinations) || []
        );
        setCBCombination(sortCombinations(combinations?.CBCombinations) || []);
        setIBCombination(sortCombinations(combinations?.IBCombinations) || []);
        setUOM(productCombinationDetails?.UOM);
        // setting default height and width
        setP_Height(orderProduct?.customizeProductHeight);
        setP_Width(orderProduct?.customizeProductWidth);

        if (orderProduct?.customizedProductBackSelected) {
          setbackselected(orderProduct?.customizedProductBackSelected);
        }
      }
    }
  }, [
    loading,
    product,
    orderItemId,
    orderId,
    productType,
    productCombinationDetails,
  ]);

  // /**get productCombinationDetails by product name */
  // useEffect(() => {
  //   dispatch(fetchCustomizeProductWithCombinationsByUrl(productname));
  // }, [dispatch, productname]);
  /**get perticuler req for price document from rise query model */
  useEffect(() => {
    if (rfpId) {
      dispatch(getRequestForPriceProductCombinations(rfpId));
    }
  }, [rfpId, dispatch]);

  useEffect(() => {
    if (
      rfpLoading === "fulfilled" &&
      requestForPriceProductCombinations &&
      Object.keys(requestForPriceProductCombinations).length > 0
    ) {
      setRequestProducts(
        requestForPriceProductCombinations?.updatedWishlist[0]
      );
    }
  }, [rfpLoading, requestForPriceProductCombinations]);

  useEffect(() => {
    if (
      requestProducts !== undefined &&
      Object.keys(requestProducts).length > 0 &&
      productCombinationDetails?.product?.length > 0
    ) {
      const arrays = [
        "FrontCombinations",
        "SAFCombinations",
        "CBCombinations",
        "IBCombinations",
      ];
      const combinations = {};

      for (let array of arrays) {
        const arrayCombinations = [];

        for (let field of requestProducts[array]) {
          const data = {
            attributeId: field?.attributeId,
            combinations: [
              {
                attributeId: field?.attributeId,
                parameterId: {
                  ...field.parameterId,
                  attributeId: field?.attributeId?._id,
                },
                pngImage: field?.pngImage,
                positionId: field.positionId,
              },
            ],
            isShow: true,
            parameterId: field.parameterId?._id,
            positionId: field.positionId?._id,
            positionX: 0,
            positionY: 0,
          };
          arrayCombinations.push(data);
        }

        combinations[`${array}`] = arrayCombinations;
      }
      if (productCombinationDetails?.product?.length > 0) {
        setProductDetails(productCombinationDetails?.product[0]);
      }

      if (requestProducts) {
        setFrontCombination(
          sortCombinations(combinations?.FrontCombinations) || []
        );

        setSAFCombination(
          sortCombinations(combinations?.SAFCombinations) || []
        );
        setCBCombination(sortCombinations(combinations?.CBCombinations) || []);
        setIBCombination(sortCombinations(combinations?.IBCombinations) || []);
        setUOM(productCombinationDetails?.UOM);
        // setting default height and width
        setP_Height(requestForPriceProductCombinations?.customizeProductHeight);
        setP_Width(requestForPriceProductCombinations?.customizeProductWidth);

        if (requestForPriceProductCombinations?.customizedProductBackSelected) {
          setbackselected(
            requestForPriceProductCombinations?.customizedProductBackSelected
          );
        }
      }
    }
  }, [
    rfpLoading,
    requestProducts,
    requestForPriceProductCombinations,
    productCombinationDetails,
  ]);

  useEffect(() => {
    if (cartCustomizeProductLoading === "fulfilled" && cartCustomizeProduct) {
      setCartProductIds(cartCustomizeProduct);
    }
  }, [cartCustomizeProductLoading, cartCustomizeProduct]);

  useEffect(() => {
    if (addedCartProduct) {
      setCartProductIds((prevState) => [...prevState, addedCartProduct]);
    }
  }, [addedCartProduct]);

  useEffect(() => {
    if (
      userdetails &&
      Object.keys(userdetails)?.length > 0 &&
      productDetails?._id
    ) {
      if (isWishlist && isArchitect) {
        dispatch(
          fetchWishlistCustomizedProductsByWishlistId({
            id: isWishlist,
          })
        );
        dispatch(
          fetchCustomizedProductsWishlist({
            userId: userdetails?._id,
          })
        );
      } else if (isWishlist) {
        dispatch(
          fetchWishlistCustomizedProductsById({
            id: productDetails?._id,
            userId: userdetails?._id,
            product: [],
          })
        );
        dispatch(
          fetchCustomizedProductsWishlist({
            userId: userdetails?._id,
          })
        );
      } else {
        dispatch(
          fetchCustomizedProductsWishlist({
            userId: userdetails?._id,
          })
        );
      }

      dispatch(
        getCartCustomizeProduct({
          id: userdetails?._id,
          productId: productDetails?._id,
        })
      );
    } else if (
      userdetails &&
      Object.keys(userdetails)?.length === 0 &&
      productDetails?._id &&
      whishlistdata
    ) {
      if (isArchitect) {
        dispatch(
          fetchWishlistCustomizedProductsByWishlistId({
            id: isWishlist,
          })
        );
        dispatch(
          fetchWishlistCustomizedProductsById({
            id: productDetails?._id,
            userId: "unauthenticated",
            product: whishlistdata,
          })
        );
      } else {
        dispatch(
          fetchWishlistCustomizedProductsById({
            id: productDetails?._id,
            userId: "unauthenticated",
            product: whishlistdata,
          })
        );
      }
    }
  }, [
    dispatch,
    userdetails,
    productDetails?._id,
    whishlistdata,
    isWishlist,
    isArchitect,
  ]);

  useEffect(() => {
    if (
      wishlistLoading === "fulfilled" &&
      isWishlist &&
      isArchitect &&
      customizedWishlistProduct.length > 0
    ) {
      setWishlistProductOfUser(customizedWishlistProduct[0]);
    }
  }, [isWishlist, isArchitect, customizedWishlistProduct, wishlistLoading]);

  useEffect(() => {
    if (wishlistProductDetails && wishlistLoading === "fulfilled") {
      if (
        userdetails &&
        Object.keys(userdetails).length > 0 &&
        isWishlist &&
        !isArchitect
      ) {
        const currentWishlist = wishlistProductDetails.find(
          (data) => data?._id.toString() === isWishlist.toString()
        );
        if (currentWishlist && isNew) {
          setWishlistProducts([currentWishlist]);
        } else {
          setWishlistProducts(customizedProductWishlist);
        }
      } else if (
        customizedProductWishlist &&
        userdetails &&
        Object.keys(userdetails).length > 0
      ) {
        setWishlistProducts(customizedProductWishlist);
      } else if (
        Object.keys(userdetails).length === 0 &&
        isWishlist &&
        !isArchitect
      ) {
        const currentWishlist = wishlistProductDetails.find(
          (data) => data?._id.toString() === isWishlist.toString()
        );
        if (currentWishlist && isNew) {
          setWishlistProducts([currentWishlist]);
        } else {
          setWishlistProducts(
            whishlistdata.filter((data) => data?.customizedProductId)
          );
        }
      } else if (Object.keys(userdetails).length === 0 && !isWishlist) {
        setWishlistProducts(
          whishlistdata.filter((data) => data?.customizedProductId)
        );
      } else if (
        Object.keys(userdetails).length === 0 &&
        isWishlist &&
        isArchitect
      ) {
        setWishlistProducts(
          whishlistdata.filter((data) => data?.customizedProductId)
        );
      }
    }
  }, [
    customizedProductWishlist,
    userdetails,
    wishlistProductDetails,
    wishlistLoading,
    whishlistdata,
    isWishlist,
    isArchitect,
    isNew,
  ]);

  const handleAddToWishlist = async (product) => {
    try {
      const copyAttributes = (data) => ({
        attributeId: data?.attributeId?._id,
        isShow: data?.isShow,
        parameterId: data?.parameterId,
        positionId: data?.positionId,
        positionX: data?.positionX,
        positionY: data?.positionY,
      });
      /**i am creating new branch master */
      const Front = FrontCombination?.map(copyAttributes) || [];
      const SAF = SAFCombination?.map(copyAttributes) || [];
      const IB = IBCombination?.map(copyAttributes) || [];
      const CB = CBCombination?.map(copyAttributes) || [];

      const productData = {
        customizedProductId: product?._id,
        customizedProductBackSelected: productDetails?.RequestForPrice
          ? ""
          : backselected
          ? backselected
          : "",
        Front,
        SAF,
        IB,
        CB,
        customizeProductWidth: P_Width,
        customizeProductHeight: P_Height,
      };
      setIsNew(false);
      if (Object.keys(userdetails)?.length > 0) {
        await dispatch(addToWishlist(productData)).unwrap();
        if (isWishlist) {
          await dispatch(
            fetchCustomizedProductsWishlist({
              userId: userdetails?._id,
            })
          ).unwrap();
          await dispatch(
            fetchWishlistCustomizedProductsById({
              id: productDetails?._id,
              userId: userdetails?._id,
              product: [],
            })
          ).unwrap();
        } else {
          dispatch(
            fetchCustomizedProductsWishlist({
              userId: userdetails?._id,
            })
          );
        }
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
      setIsNew(false);
      if (Object.keys(userdetails)?.length > 0) {
        await dispatch(removeFromWishlist(id)).unwrap();
        if (isWishlist) {
          await dispatch(
            fetchCustomizedProductsWishlist({
              userId: userdetails?._id,
            })
          ).unwrap();
          await dispatch(
            fetchWishlistCustomizedProductsById({
              id: productDetails?._id,
              userId: userdetails?._id,
              product: [],
            })
          ).unwrap();
        } else {
          dispatch(
            fetchCustomizedProductsWishlist({
              userId: userdetails?._id,
            })
          );
        }
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

  const handleAddTocart = async (product) => {
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

      const Front = FrontCombination?.map(copyAttributes) || [];
      const SAF = SAFCombination?.map(copyAttributes) || [];
      const IB = IBCombination?.map(copyAttributes) || [];
      const CB = CBCombination?.map(copyAttributes) || [];

      const productData = {
        customizedProductId: product?._id,
        customizedProductBackSelected: productDetails?.RequestForPrice
          ? ""
          : backselected,
        Front,
        SAF,
        IB,
        CB,
        customizeProductWidth: P_Width,
        customizeProductHeight: P_Height,
        quantity: cartProductQuantity,
      };

      if (Object.keys(userdetails)?.length > 0) {
        await dispatch(addToCart(productData)).unwrap();
        setStatus("added");
      } else {
        dispatch(addToWhislist({ _id: Date.now(), ...productData })); // saving in local storage
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

  const debouncedDispatch = debounce((id, newQuantity) => {
    dispatch(
      updateCartProductQuantity({
        id,
        productData: { quantity: newQuantity },
      })
    );
  }, 500);

  const handleQuantity = (value) => {
    const newQuantity = Math.max(1, cartProductQuantity + value);
    if (status === "removed") {
      setCartProductQuantity(newQuantity);
    } else if (status === "added") {
      setCartProductQuantity(newQuantity);
      debouncedDispatch(cartProduct?._id, newQuantity);
    }
  };

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
      loading === "fulfilled" &&
      productCombinationDetails &&
      !isWishlist &&
      !rfpId &&
      !orderId &&
      !productType &&
      !orderItemId
    ) {
      if (productCombinationDetails?.product?.length > 0) {
        setProductDetails(productCombinationDetails?.product[0]);
      }

      setFrontCombination(
        sortCombinations(productCombinationDetails?.Front) || []
      );
      setSAFCombination(sortCombinations(productCombinationDetails?.SAF) || []);
      setCBCombination(sortCombinations(productCombinationDetails?.CB) || []);
      setIBCombination(sortCombinations(productCombinationDetails?.IB) || []);
      setUOM(productCombinationDetails?.UOM);
      // setting default height and width
      setP_Height(productCombinationDetails?.product[0]?.DefaultHeight);
      setP_Width(productCombinationDetails?.product[0]?.DefaultWidth);
    }
  }, [
    loading,
    productCombinationDetails,
    isWishlist,
    rfpId,
    orderId,
    productType,
    orderItemId,
  ]);

  useEffect(() => {
    if (loading === "fulfilled" && productCombinationDetails && isWishlist) {
      const arrays = [
        "FrontCombinations",
        "SAFCombinations",
        "CBCombinations",
        "IBCombinations",
      ];
      const combinations = {};
      if (
        wishlistProductOfUser &&
        Object.keys(wishlistProductOfUser)?.length > 0
      ) {
        for (let array of arrays) {
          const arrayCombinations = [];

          for (let field of wishlistProductOfUser[array]) {
            const data = {
              attributeId: field?.attributeId,
              combinations: [
                {
                  attributeId: field?.attributeId,
                  parameterId: {
                    ...field.parameterId,
                    attributeId: field?.attributeId?._id,
                  },
                  pngImage: field?.pngImage,
                  positionId: field.positionId,
                },
              ],
              isShow: true,
              parameterId: field.parameterId?._id,
              positionId: field.positionId?._id,
              positionX: 0,
              positionY: 0,
            };
            arrayCombinations.push(data);
          }

          combinations[`${array}`] = arrayCombinations;
        }
      }

      if (productCombinationDetails?.product?.length > 0) {
        setProductDetails(productCombinationDetails?.product[0]);
      }

      if (wishlistProductOfUser) {
        setFrontCombination(
          sortCombinations(combinations?.FrontCombinations) || []
        );

        setSAFCombination(
          sortCombinations(combinations?.SAFCombinations) || []
        );
        setCBCombination(sortCombinations(combinations?.CBCombinations) || []);
        setIBCombination(sortCombinations(combinations?.IBCombinations) || []);
        setUOM(productCombinationDetails?.UOM);
        // setting default height and width
        setP_Height(wishlistProductOfUser?.customizeProductHeight);
        setP_Width(wishlistProductOfUser?.customizeProductWidth);

        if (wishlistProductOfUser?.customizedProductBackSelected) {
          setbackselected(wishlistProductOfUser?.customizedProductBackSelected);
        }
      }
    }
  }, [loading, productCombinationDetails, wishlistProductOfUser, isWishlist]);

  let condition;

  if (
    FrontCombination &&
    FrontCombination.length > 0 &&
    ((CBCombination && CBCombination.length > 0) ||
      (IBCombination && IBCombination.length > 0) ||
      (SAFCombination && SAFCombination.length > 0))
  ) {
    condition = true;
  } else if (FrontCombination && FrontCombination.length > 0) {
    condition = false;
  }
  useEffect(() => {
    const { SAF, CB, IB } = productCombinationDetails || {};

    if (SAF?.length > 0) {
      setbackselected("SAF");
    } else if (CB?.length > 0) {
      setbackselected("CB");
    } else if (IB?.length > 0) {
      setbackselected("IB");
    }
  }, [productCombinationDetails]);

  const calculateCustomizedPrice = useCallback(
    (combinations, priceFor) => {
      if (productDetails && combinations?.length > 0) {
        const totalCustomizedPrice =
          productDetails[priceFor] +
          getPrice(productDetails, combinations, UOM, {
            DefaultHeight: P_Height,
            DefaultWidth: P_Width,
          });

        return totalCustomizedPrice;
      }
      return 0;
    },
    [P_Width, P_Height, UOM, productDetails]
  );

  useEffect(() => {
    setcustomizedProductPrice((prevState) => ({
      ...prevState,
      customizedProductPriceFront: calculateCustomizedPrice(
        FrontCombination,
        "FixedPrice"
      ),
      customizedProductPriceSAF: calculateCustomizedPrice(
        SAFCombination,
        "FixedPriceSAF"
      ),
      customizedProductPriceCB: calculateCustomizedPrice(
        CBCombination,
        "FixedPriceCB"
      ),
      customizedProductPriceIB: calculateCustomizedPrice(
        IBCombination,
        "FixedPriceIB"
      ),
    }));
  }, [
    SAFCombination,
    CBCombination,
    IBCombination,
    FrontCombination,
    calculateCustomizedPrice,
  ]);

  useEffect(() => {
    const selectedKey = backselectedMap[backselected];
    if (selectedKey) {
      setcalculateTotalCustomizedProduct(
        Number(customizedProductPrice.customizedProductPriceFront) +
          Number(customizedProductPrice[selectedKey])
      );
    } else {
      setcalculateTotalCustomizedProduct(
        Number(customizedProductPrice.customizedProductPriceFront)
      );
    }
  }, [backselected, customizedProductPrice]);

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
      toastError(error?.response?.data?.message);
    }
  }, [productDetails._id]);

  useEffect(() => {
    getTotalRating();
  }, [getTotalRating]);

  const getreview = useCallback(async () => {
    try {
      if (!productDetails?._id) {
        return setreviewdata([]);
      }
      const { data } = await axiosInstance.get(
        `/api/review/product/${productDetails._id}?model=${model}`
      );
      setreviewdata(data.data);
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }, [productDetails?._id]);

  const getProductByProducTtag = useCallback(
    async (productTags) => {
      try {
        if (productTags?.length > 0) {
          const { data } = await axiosInstance.post(
            "/api/customized-product/product-tag",
            {
              tags: productTags,
            }
          );

          if (data?.success) {
            setProductData(
              data?.data.filter(
                (p) => p?.productId?._id !== productDetails?._id
              )
            );
          }
        }
      } catch (error) {
        toastError(error?.response?.data?.message);
      }
    },
    [productDetails?._id]
  );

  const getProductDescriptions = useCallback(async () => {
    try {
      if (productDetails?._id) {
        const { data } = await axiosInstance.get(
          `/api/ProductDescriptions/getProductDescriptions/${productDetails?._id}`
        );

        if (data?.success) {
          setDescriptionsData(data.data);
        }
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }, [productDetails?._id]);

  useEffect(() => {
    if (productDetails) {
      getreview();
      getProductDescriptions();
      getProductByProducTtag(productDetails?.tags);
    }
  }, [
    getreview,
    getProductByProducTtag,
    productDetails,
    getProductDescriptions,
  ]);

  const ShareModalClose = () => {
    setshowShareModal(false);
  };

  // const toggleCart = () => {
  //   setmanagecart(!managecart);
  // };

  const handleClicked = () => {
    setShowRaiseAQueryModal(true);
  };

  const RaiseModalClose = () => {
    setShowRaiseAQueryModal(false);
  };

  const calculateWidth = (e) => {
    let value = e.target.value;
    setP_Width(value);
  };
  const calculateHeight = (e) => {
    setP_Height(e.target.value);
  };

  //  for wishlist
  useEffect(() => {
    if (
      wishlistProducts &&
      wishlistProducts?.length > 0 &&
      FrontCombination &&
      SAFCombination &&
      CBCombination &&
      IBCombination &&
      userdetails &&
      Object.keys(userdetails).length > 0
    ) {
      const productData = {
        productId: productDetails?._id,
        Front: FrontCombination,
        SAF: SAFCombination,
        CB: CBCombination,
        IB: IBCombination,
      };

      const data = isCustomizedProductDetailsInWishlist(
        productData,
        wishlistProducts
      );

      if (
        data &&
        data?.FrontCombinations &&
        data?.FrontCombinations?.length > 0
      ) {
        setWishlistProductOfUser(data);
      }
      setIsWishlistProducts(data);
    } else if (
      whishlistdata &&
      FrontCombination &&
      SAFCombination &&
      CBCombination &&
      IBCombination &&
      wishlistProducts &&
      userdetails &&
      Object.keys(userdetails)?.length === 0
    ) {
      const productData = {
        productId: productDetails?._id,
        Front: FrontCombination,
        SAF: SAFCombination,
        CB: CBCombination,
        IB: IBCombination,
      };

      const data = isCustomizedProductDetailsInWishlist(
        productData,
        wishlistProducts
      );
      if (
        data &&
        data?.FrontCombinations &&
        data?.FrontCombinations?.length > 0
      ) {
        setWishlistProductOfUser(data);
      }

      setIsWishlistProducts(data);
    } else {
      setIsWishlistProducts(null);
    }
  }, [
    productDetails,
    wishlistProducts,
    FrontCombination,
    SAFCombination,
    IBCombination,
    CBCombination,
    userdetails,
    whishlistdata,
  ]);

  //  for cart
  useEffect(() => {
    if (
      cartProductIds &&
      cartProductIds?.length > 0 &&
      Object.keys(userdetails).length > 0
    ) {
      const productData = {
        productId: productDetails?._id,
        Front: FrontCombination,
        SAF: SAFCombination,
        CB: CBCombination,
        IB: IBCombination,
      };

      const data = isCustomizedProductDetailsInWishlist(
        productData,
        cartProductIds
      );
      if (data) {
        setStatus("added");
        setCartProductQuantity(data?.quantity);
        setCartProduct(data);
      } else {
        setStatus("removed");
        setCartProductQuantity(1);
        setCartProduct(null);
      }
    } else if (
      cartdata &&
      cartProductIds &&
      userdetails &&
      Object.keys(userdetails).length === 0
    ) {
      const productData = {
        productId: productDetails?._id,
        Front: FrontCombination,
        SAF: SAFCombination,
        CB: CBCombination,
        IB: IBCombination,
      };

      const data = isCustomizedProductDetailsInWishlist(productData, cartdata);

      if (data) {
        setStatus("added");
        setCartProductQuantity(data?.quantity);
        setCartProduct(data);
      } else {
        setStatus("removed");
        setCartProductQuantity(1);
        setCartProduct(null);
      }
    } else {
      setCartProduct(null);
    }
  }, [
    cartdata,
    productDetails,
    cartProductIds,
    FrontCombination,
    SAFCombination,
    IBCombination,
    CBCombination,
    userdetails,
  ]);

  if (loading === "pending") {
    return <Preloader />;
  }

  return (
    <>
      <SideBar />

      <SnackbarMessage setState={setState} state={state} />
      {/* Quotation Show */}
      <RaiseAQuery
        showRaiseAQueryModal={ShowRaiseAQueryModal}
        RaiseModalClose={RaiseModalClose}
        product={productDetails}
        productCombination={(function () {
          const copyAttributes = (data) => ({
            attributeId: data?.attributeId?._id,
            isShow: data?.isShow,
            parameterId: data?.parameterId,
            positionId: data?.positionId,
            positionX: data?.positionX,
            positionY: data?.positionY,
          });

          const Front = FrontCombination?.map(copyAttributes) || [];
          const SAF = SAFCombination?.map(copyAttributes) || [];
          const IB = IBCombination?.map(copyAttributes) || [];
          const CB = CBCombination?.map(copyAttributes) || [];

          return {
            customizedProductId: productDetails?._id,
            customizedProductBackSelected: productDetails?.RequestForPrice
              ? ""
              : backselected
              ? backselected
              : "",
            Front,
            SAF,
            IB,
            CB,
            customizeProductWidth: P_Width,
            customizeProductHeight: P_Height,
            architectId: isArchitect,
          };
        })()}
      />

      <ShareProduct
        ProductName={productDetails?.ProductName}
        showShareModal={showShareModal}
        ShareModalClose={ShareModalClose}
      />

      {/* Seo Title Desc */}

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
          Customized Product Details
        </h3> */}
        {/* <p
          style={{
            paddingLeft: 12,
            paddingTop: 10,
            textAlign: "center",
            color: "#fff",
          }}
        >
          <Link to={`/`} style={{ fontSize: 16, color: "#fff" }}>
            <i className="fa-solid fa-house-user"></i>
          </Link>{" "}
          &nbsp;
          <HomeIcon />{" "}
          <Link
            to={`/collection/${collectionurl}`}
            style={{ fontSize: 16, color: "#fff" }}
          >
            {collectionurl}
          </Link>{" "}
          &nbsp;
          <NavigateNextIcon />
          <Link style={{ fontSize: 16, color: "#fff" }}>
            {productname}
          </Link>{" "}
        </p> */}
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
        <Link to={`/`} style={{ fontSize: 16, color: "#324040" }}>
          {/* <i className="fa-solid fa-house-user"></i> */}
          <HomeIcon />{" "}
        </Link>{" "}
        &nbsp;
        <NavigateNextIcon />
        &nbsp;
        <Link
          to={`/collection/${collectionurl}`}
          style={{ fontSize: 16, color: "#324040" }}
        >
          {collectionurl}
        </Link>{" "}
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
            {productDetails && productDetails?.ProductImage?.length > 0 && (
              <RoomSliderCusProd
                productImages={productDetails?.ProductImage}
                type=""
              />
            )}
          </div>
        </div>

        <div className="col-lg-3 CustomizedProductNameSection CutomizedProductaddqtystyle1">
          <div>
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
              className="col-lg-8 RatingDivWidthStyle"
              style={{ float: "left" }}
            >
              <Rating
                totalRating={UserRatingData.totalRating}
                totalUser={UserRatingData.totalUser}
                ratingData={UserRatingData.ratingData}
                productdetails={productDetails}
                setUserRatingData={setUserRatingData}
                getTotalRating={getTotalRating}
                model={model}
              />
            </div>
            <div className="col-lg-4" style={{ float: "left" }}>
              {isWishlistProducts ? (
                <IconButton
                  color="primary"
                  aria-label="dislike"
                  style={{
                    // position: "absolute",
                    // top: "10px",
                    // right: "10px",
                    // marginTop: "7px",
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
                  onClick={() => handleAddToWishlist(productDetails)}
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

          <br></br>
          <br></br>
          <center>
            <button
              className="badge btn-default Request-for-Price-btn p-3"
              type="button"
              style={{
                width: "80%",
                textTransform: "uppercase",
                backgroundColor: "#A08862",
              }}
              onClick={handleClicked}
            >
              {productDetails?.RequestForPrice
                ? "Request  For  Price"
                : "Get Price"}
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
          {/* <Modal
            open={showPrice}
            onClose={() => setShowModal(false)}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            width="50%"
            height="50vh"
            overflow={"scroll"}
          >
            <div
              className="col-lg-5"
              style={{ marginLeft: "30%", marginTop: "25vh" }}
            >
              <ProductCalculation
                product={productDetails}
                setP_Height={setP_Height}
                setP_Width={setP_Width}
                P_Width={P_Width}
                P_Height={P_Height}
                setShowPrice={setShowPrice}
                calculateTotalCustomizedProduct={
                  calculateTotalCustomizedProduct
                }
              />
            </div>
          </Modal> */}
          <div>
            {productDetails?.SellingType === "Installment" && (
              <>
                <br></br>
                {/* input box to change price */}
                <div className="row mt-2">
                  <div className="col-lg-12">
                    <label>Select Buying Type</label>
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
                        style={{ backgroundColor: "#475b52" }}
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
                          {productDetails?.Installment &&
                            productDetails?.Installment.map((p, i) => (
                              <p key={p._id}>
                                {i === 0 ? (
                                  <>
                                    <i className="fa fa-check-square-o"></i>{" "}
                                    {p.Name} - ₹{" "}
                                    {getPercentage(
                                      CustomizedFinialAmount(
                                        calculateTotalCustomizedProduct,
                                        productDetails
                                      ),
                                      p.Amount
                                    )}{" "}
                                  </>
                                ) : (
                                  <>
                                    <i className="fa fa-square-o"></i> {p.Name}{" "}
                                    - ₹{" "}
                                    {getPercentage(
                                      CustomizedFinialAmount(
                                        calculateTotalCustomizedProduct,
                                        productDetails
                                      ),
                                      p.Amount
                                    )}
                                  </>
                                )}
                              </p>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div></div>
        </div>

        {((userdetails &&
          userdetails.userRole?.find((role) => role?.name === "Architect")) ||
          !productDetails?.RequestForPrice) && (
          <>
            <center>
              <br></br>
              <div
                className="row"
                style={{ paddingLeft: "0px", paddingRight: "0px" }}
              >
                <h3 className="RailingoXAIVisualizerStyle">
                  Railingo X AI Visualizer
                </h3>
              </div>
            </center>
            <br></br>
            <br></br>
            <br></br>
            <div
              className="row"
              style={{ paddingLeft: "0px", paddingRight: "0px" }}
            >
              <div
                className={`col-md-${
                  condition ? "6" : "12"
                } CutomizedProductSectionMobileViewStyle`}
                //   overflowY: "scroll",
                //   // display: "flex",
                // }}
              >
                <div
                  className={`col-md-${condition ? "12" : "6"}`}
                  style={{ float: "left" }}
                >
                  <ProductCustomizedProduct
                    varientproductdetails={FrontCombination}
                    name="Front Side"
                    margin={"7px"}
                    product={productDetails}
                  />
                </div>

                <div
                  className={`col-md-${condition ? "12" : "6"}`}
                  style={{
                    float: "left",
                    margin: condition ? "7px 7px 8px" : "0",
                    width: condition ? "99%" : "45%",
                    marginLeft: condition ? "10px" : "50px",
                  }}
                >
                  <br></br>
                  <center>
                    <h6
                      style={{
                        backgroundColor: "#475b52",
                        padding: "10px",
                        color: "#fff",
                        // borderRadius: "10px",
                      }}
                    >
                      FRONT VIEW
                    </h6>
                  </center>
                  <table className="table table-striped CustomizedTableZoomEffect">
                    <thead>
                      <tr>
                        <th>Available Customization</th>
                        <th>Current Selection</th>
                        <th style={{ textAlign: "center" }}>Visuals</th>
                        <th style={{ textAlign: "center" }}>Customize</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FrontCombination &&
                        FrontCombination.length > 0 &&
                        FrontCombination.map((p, index) => {
                          return (
                            p?.combinations?.length > 0 && (
                              <AttributeCombinations
                                key={index}
                                id="Front"
                                optionvalue={p}
                                setCombination={setFrontCombination}
                                Combination={FrontCombination}
                              />
                            )
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                {/* <ProductImageSection img={productDetails} /> */}
              </div>

              <>
                <div className="col-lg-6 CutomizedProductSectionMobileViewStyle2">
                  {SAFCombination?.length > 0 && backselected === "SAF" && (
                    <ProductCustomizedProduct
                      varientproductdetails={SAFCombination}
                      // attribute={getallbackdetails?.allCombinationssaf}
                      attribute={SAFCombination}
                      attributePosition={SAFCombination}
                      name="Standard Back"
                      margin={"7px"}
                      product={productDetails}
                    />
                  )}

                  {CBCombination?.length > 0 && backselected === "CB" && (
                    <ProductCustomizedProduct
                      varientproductdetails={CBCombination}
                      // attribute={getallbackdetails?.allCombinationssaf}
                      attribute={CBCombination}
                      attributePosition={CBCombination}
                      name="Premium Back"
                      margin={"7px"}
                      product={productDetails}
                    />
                  )}

                  {IBCombination?.length > 0 && backselected === "IB" && (
                    <ProductCustomizedProduct
                      varientproductdetails={IBCombination}
                      // attribute={getallbackdetails?.allCombinationssaf}
                      attribute={IBCombination}
                      attributePosition={IBCombination}
                      name="Exclusive Back"
                      margin={"7px"}
                      product={productDetails}
                    />
                  )}

                  <div
                    className={`col-md-${condition ? "12" : "6"}`}
                    style={{ float: "left", margin: "7px 7px 8px" }}
                  >
                    {(SAFCombination?.length > 0 ||
                      CBCombination?.length > 0 ||
                      IBCombination?.length > 0) && (
                      <div className="col-lg-12" style={{ float: "left" }}>
                        <br></br>
                        <center>
                          <h6
                            style={{
                              backgroundColor: "#475b52",
                              padding: "10px",
                              color: "#fff",
                              // borderRadius: "10px",
                            }}
                          >
                            BACK VIEW
                          </h6>

                          <div
                            className="btn-group"
                            role="group"
                            aria-label="Basic radio toggle button group"
                          >
                            {SAFCombination?.length > 0 && (
                              <>
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="btnradio"
                                  id="SAF"
                                  autoComplete="off"
                                  checked={backselected === "SAF"}
                                  onClick={() => setbackselected("SAF")}
                                />
                                <label
                                  className="btn btn-outline-primary buttongroupstyling"
                                  htmlFor="SAF"
                                  style={{
                                    fontSize: "10px",
                                    fontWeight: "800",
                                    lineHeight: "1.2",
                                  }}
                                >
                                  Standard Back
                                </label>
                              </>
                            )}

                            {CBCombination?.length > 0 && (
                              <>
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="btnradio"
                                  id="CB"
                                  autoComplete="off"
                                  checked={backselected === "CB"}
                                  onClick={() => setbackselected("CB")}
                                />
                                <label
                                  className="btn btn-outline-primary buttongroupstyling"
                                  htmlFor="CB"
                                  style={{
                                    fontSize: "10px",
                                    fontWeight: "800",
                                    lineHeight: "1.2",
                                  }}
                                >
                                  Premium Back
                                </label>
                              </>
                            )}

                            {IBCombination?.length > 0 && (
                              <>
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="btnradio"
                                  id="IB"
                                  autoComplete="off"
                                  checked={backselected === "IB"}
                                  onClick={() => setbackselected("IB")}
                                />
                                <label
                                  className="btn btn-outline-primary buttongroupstyling"
                                  htmlFor="IB"
                                  style={{
                                    fontSize: "10px",
                                    fontWeight: "800",
                                    lineHeight: "1.2",
                                  }}
                                >
                                  Exclusive Back
                                </label>
                              </>
                            )}
                          </div>
                        </center>
                        <br></br>

                        {/* Select this If Same As Front Selected */}
                        {backselected === "SAF" && (
                          <table className="table table-striped CustomizedTableZoomEffect">
                            <thead>
                              <tr>
                                <th>Available Customization</th>
                                <th>Current Selection</th>
                                <th style={{ textAlign: "center" }}>Visuals</th>
                                <th style={{ textAlign: "center" }}>
                                  Customize
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {backselected === "SAF" &&
                                SAFCombination &&
                                SAFCombination.length > 0 &&
                                SAFCombination.map((p, index) => {
                                  return (
                                    p?.combinations?.length > 0 && (
                                      // <div key={index}>
                                      <AttributeCombinations
                                        id="SAF"
                                        optionvalue={p}
                                        setCombination={setSAFCombination}
                                        Combination={SAFCombination}
                                      />
                                    )
                                  );
                                })}
                            </tbody>
                          </table>
                        )}

                        {/* Back Selected For CB */}
                        {backselected === "CB" && (
                          <table className="table table-striped CustomizedTableZoomEffect">
                            <thead>
                              <tr>
                                <th>Available Customization</th>
                                <th>Current Selection</th>
                                <th style={{ textAlign: "center" }}>Visuals</th>
                                <th style={{ textAlign: "center" }}>
                                  Customize
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {backselected === "CB" &&
                                CBCombination &&
                                CBCombination.length > 0 &&
                                CBCombination.map((p, index) => {
                                  return (
                                    p?.combinations?.length > 0 && (
                                      <AttributeCombinations
                                        id="CB"
                                        optionvalue={p}
                                        setCombination={setCBCombination}
                                        Combination={CBCombination}
                                      />
                                    )
                                  );
                                })}
                            </tbody>
                          </table>
                        )}
                        {/* Back Selected For Ignore BAck */}
                        {backselected === "IB" && (
                          <table className="table table-striped CustomizedTableZoomEffect">
                            <thead>
                              <tr>
                                <th>Available Customization</th>
                                <th>Current Selection</th>
                                <th style={{ textAlign: "center" }}>Visuals</th>
                                <th style={{ textAlign: "center" }}>
                                  Customize
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {backselected === "IB" &&
                                IBCombination &&
                                IBCombination.length > 0 &&
                                IBCombination.map((p, index) => {
                                  return (
                                    p?.combinations?.length > 0 && (
                                      <AttributeCombinations
                                        id="IB"
                                        optionvalue={p}
                                        setCombination={setIBCombination}
                                        Combination={IBCombination}
                                      />
                                    )
                                  );
                                })}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            </div>
            {/* Product Calculation Start */}
            <div className="row CustomizedProductCalculationSection">
              {productDetails?.DefaultHeight ||
              productDetails?.MinHeight ||
              productDetails?.MaxHeight ? (
                <>
                  <div
                    className="col-lg-1 CustomizedProductCalculationSectionDiv1"
                    style={{ float: "left" }}
                  >
                    <label htmlFor="height" style={{ color: "#000" }}>
                      {productDetails?.DefaultWidth ||
                      productDetails?.DefaultWidth ||
                      productDetails?.DefaultWidth
                        ? "Height (ft)"
                        : "Length (ft)"}
                    </label>
                    <input
                      type="number"
                      min={productDetails?.MinHeight}
                      max={productDetails?.MaxHeight}
                      value={P_Height}
                      id="height"
                      className="form-control"
                      placeholder="Enter Height"
                      onChange={calculateHeight}
                      style={{ color: "#475B52", border: "2px solid #475B52" }}
                      step={1}
                    />
                    {P_Height > productDetails?.MaxHeight && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "5px",
                        }}
                      >
                        Height should not be greater than{" "}
                        {productDetails?.MaxHeight}
                      </p>
                    )}
                    {P_Height < productDetails?.MinHeight && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "5px",
                        }}
                      >
                        Height should not be less than{" "}
                        {productDetails?.MinHeight}
                      </p>
                    )}
                  </div>

                  <div
                    className="col-lg-1 CustomizedProductCalculationSectionDiv2"
                    style={{ paddingTop: "30px", float: "left", width: "4%" }}
                  >
                    <center>
                      <span style={{ fontWeight: "600" }}> X </span>
                    </center>
                  </div>
                </>
              ) : null}

              {productDetails?.DefaultWidth ||
              productDetails?.MinWidth ||
              productDetails?.MaxWidth ? (
                <>
                  <div
                    className="col-lg-1 CustomizedProductCalculationSectionDiv1"
                    style={{ float: "left" }}
                  >
                    <label htmlFor="width" style={{ color: "#000" }}>
                      Width (ft)
                    </label>
                    <input
                      type="number"
                      min={productDetails?.MinWidth}
                      max={productDetails?.MaxWidth}
                      className="form-control"
                      placeholder="Enter Width"
                      id="width"
                      value={P_Width}
                      style={{ color: "#475B52", border: "2px solid #475B52" }}
                      onChange={calculateWidth}
                    />
                    {P_Width > productDetails?.MaxWidth && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "5px",
                        }}
                      >
                        Width should not be greater than{" "}
                        {productDetails?.MaxWidth}
                      </p>
                    )}
                    {P_Width < productDetails?.MinWidth && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "5px",
                        }}
                      >
                        Width should not be less than {productDetails?.MinWidth}
                      </p>
                    )}
                  </div>
                  <div
                    className="col-lg-1 CustomizedProductCalculationSectionDiv2"
                    style={{ paddingTop: "30px", float: "left", width: "4%" }}
                  >
                    <center>
                      <span style={{ fontWeight: "600" }}> X </span>
                    </center>
                  </div>
                </>
              ) : null}

              <div
                className="col-lg-1 CustomizedProductCalculationSectionDiv4"
                style={{ float: "left", width: "12%" }}
              >
                <label htmlFor="rate" style={{ color: "#000" }}>
                  Rate/
                  {`${
                    P_Width && P_Height
                      ? "Sq.ft"
                      : P_Width
                      ? "Length"
                      : P_Height
                      ? "Rft"
                      : "Pice"
                  }`}
                </label>
                <br></br>
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  placeholder={`${roundNumber(
                    Number(
                      P_Width && P_Height
                        ? CustomizedFinialAmount(
                            calculateTotalCustomizedProduct,
                            productDetails
                          ) /
                            (P_Width * P_Height)
                        : P_Width
                        ? CustomizedFinialAmount(
                            calculateTotalCustomizedProduct,
                            productDetails
                          ) / P_Width
                        : P_Height
                        ? CustomizedFinialAmount(
                            calculateTotalCustomizedProduct,
                            productDetails
                          ) / P_Height
                        : 0
                    )
                  )} / ${
                    P_Width && P_Height
                      ? "Sq.ft"
                      : P_Width
                      ? "Length"
                      : P_Height
                      ? "Rft"
                      : "Pice"
                  }`}
                  style={{
                    color: "#475B52",
                    border: "2px solid #475B52",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    fontWeight: "600",
                    // width: "150px",
                    backgroundColor: "#fff",
                  }}
                />
              </div>
              <div
                className="col-lg-1 CustomizedProductCalculationSectionDiv2"
                style={{ paddingTop: "30px", float: "left", width: "4%" }}
              >
                <center>
                  <span style={{ fontWeight: "600" }}> = </span>
                </center>
              </div>

              <div
                className="col-lg-2 CustomizedProductCalculationSectionDiv3"
                style={{ float: "left" }}
              >
                <label htmlFor="totalPrice" style={{ color: "#000" }}>
                  Total Price
                </label>
                <br></br>
                <input
                  className="form-control"
                  type="text"
                  readOnly
                  value={`${Number(
                    CustomizedFinialAmount(
                      calculateTotalCustomizedProduct,
                      productDetails
                    )
                  ).toFixed(0)} /-`}
                  style={{
                    color: "#475B52",
                    border: "2px solid #475B52",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    // width: "150px",
                    fontWeight: "600",
                    textAlign: "center",
                    backgroundColor: "#fff",
                  }}
                />
                <p
                  style={{
                    color: "#768758",
                    fontSize: "12px",
                    marginTop: "5px",
                    textAlign: "center",
                  }}
                >
                  *GST Included
                </p>
              </div>

              <div className="col-lg-2" style={{ float: "left" }}>
                <center>
                  <button
                    className="badge btn-default Request-for-Price-btn p-3 mb-1"
                    type="button"
                    style={{
                      width: "100%",
                      textTransform: "uppercase",
                      marginTop: "20px",
                      backgroundColor: "#475B52",
                      borderRadius: "10px",
                    }}
                  >
                    Preview Quotation
                  </button>
                </center>
              </div>
              <div
                className="col-lg-3"
                style={{ float: "right", paddingTop: "22px" }}
              >
                <center>
                  {userdetails &&
                  userdetails.userRole?.find(
                    (role) => role?.name === "Architect"
                  ) ? (
                    <center>
                      <div
                        className="col-lg-6 Section3Style Section3Style1"
                        style={{ float: "left", zoom: "80%" }}
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
                            style={{ textAlign: "center", width: "35px" }}
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

                      <div
                        className="col-lg-6 Section3Style Section3Style2"
                        style={{ float: "left" }}
                      >
                        <AddToCartButton
                          onClick={() => {
                            if (!cartProduct) {
                              handleAddTocart(productDetails);
                            } else {
                              navigate("/cart");
                            }
                          }}
                          status={status}
                        />
                      </div>
                    </center>
                  ) : (
                    !productDetails?.RequestForPrice && (
                      <center>
                        <div
                          className="col-lg-6 Section3Style"
                          style={{ float: "left" }}
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
                              style={{ textAlign: "center", width: "35px" }}
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

                        <div className="col-lg-1" style={{ float: "left" }}>
                          &nbsp;
                        </div>
                        <div
                          className="col-lg-5 Section3Style"
                          style={{ float: "left" }}
                        >
                          <AddToCartButton
                            onClick={() => {
                              if (!cartProduct) {
                                handleAddTocart(productDetails);
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
                </center>
              </div>
            </div>
          </>
        )}

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

        {userdetails &&
          userdetails.userRole?.find((role) => role?.name === "Architect") &&
          allDotCustomizeproducts &&
          allDotCustomizeproducts.length > 0 && (
            <div
              className="row"
              style={{ marginTop: "30px", paddingRight: "0px" }}
            >
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
                class="carousel carousel-dark slide"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  <FeelAtHomeProducts product={allDotCustomizeproducts} />
                </div>
              </div>
            </div>
          )}
      </div>
      <br></br>
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
              className="background-video"
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
                    className="feelfreetocontactusheadingstyle"
                    style={{
                      color: "#fff",
                      textTransform: "uppercase",
                      fontWeight: "600",
                    }}
                  >
                    Feel Free to contact us
                  </h1>
                  <p style={{ color: "#fff", fontSize: "18px" }}>
                    Feel free to reach out to us for all your home decor needs.
                    We're here to assist you in turning your dreams into
                    reality.
                  </p>
                  <br></br>
                  <div className="col-lg-2" style={{ float: "left" }}>
                    &nbsp;
                  </div>
                  <div
                    className="col-lg-8 Section3Style2"
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
            <div className="col-lg-2" style={{ padding: "20px" }}>
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
      <MainFooter />
    </>
  );
};

export default CustomizedProductDetails;
