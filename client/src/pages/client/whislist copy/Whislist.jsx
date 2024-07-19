import React, { useEffect, useState, useCallback } from "react";
import { axiosInstance } from "../../../config";
// import { toastError } from "../../../utils/reactToastify";
import { useSelector, useDispatch } from "react-redux";
// import HeaderImage from "../../../assets/Image/Slider11.jpg";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import MainFooter from "../../../components/mainfooter/MainFooter";
import ProductCard from "../../../components/productcard/ProductCard";
import CustomizeProductCard from "./CustomizedProductCard";
import { getPriceForWishlist } from "../../../utils/varientimge/getPrice";
import CustomizedCombinationCard from "./CustomizedCombinationCard";
import DotCustomizeProductCardRoomIdea from "../roomideas/DotCustomizeProductCardRoomIdea";
import DotProductCardRoomIdea from "../roomideas/DotProductCardRoomIdea";
import {
  fetchWishlistProducts,
  fetchWishlistDotProducts,
  fetchWishlistCustomizedProducts,
  fetcCustomizedComboProductsForWishlist,
} from "../../../redux/slices/newWishlistSlice";
import { isSingleProductInWishlist } from "../../../utils/isInWishlist/isSingleProduct";
import {
  isCustomizedDotProductInWishlist,
  isSingleDotProductInWishlist,
} from "../../../utils/isInWishlist/isSingleProduct";
import { isCustomizedProductInWishlist } from "../../../utils/isInWishlist/isCustomizedProduct";
import { toastError } from "../../../utils/reactToastify";
import { REACT_APP_URL } from "../../../config";
// import CustomizeComboWishlistCart from "../../../components/productcard/CustomizeComboWishlistCart";
// import Preloader from "../../../components/preloader/Preloader";

const Whislist = () => {
  const dispatch = useDispatch();

  const { userdetails } = useSelector((state) => state.auth);

  const { whishlistdata } = useSelector((state) => state.whishlist);

  const {
    wishlistProducts,
    loading,
    products,
    wishlistDotProducts,
    dotProducts,
    wishlistCustomizedProducts,
    customizedProducts,
    wishlistCustomizedComboProducts,
    customizedComboForWishlist,
  } = useSelector((state) => state.wishlist);

  const [singleProductWishlist, setSingleProductWishlist] = useState([]);
  const [dotProductWishlist, setDotProductWishlist] = useState([]);
  const [customizeProductWishlist, setCustomizeProductWishlist] = useState([]);
  const [productCombinations, setProductCombinations] = useState([]);
  const [dotProduct, setDotProduct] = useState([]);

  // const [customizeProducts, setCustomizeProducts] = useState([]);

  const [customizeComboProductWishlist, setCustomizeComboProductWishlist] =
    useState([]);
  const [customizeComboProduct, setCustomizeComboProduct] = useState([]);
  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/Whislist`
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

  // fetch single products
  // useEffect(() => {
  //   if (Object.keys(userdetails)?.length > 0) {
  //     dispatch(
  //       fetchWishlistProducts({ product: [], userId: userdetails?._id })
  //     );
  //     dispatch(
  //       fetchWishlistDotProducts({ product: [], userId: userdetails?._id })
  //     );
  //   } else if (userdetails && Object.keys(userdetails)?.length === 0) {
  //     dispatch(
  //       fetchWishlistProducts({
  //         product: whishlistdata,
  //         userId: "unauthenticated",
  //       })
  //     );
  //     dispatch(
  //       fetchWishlistDotProducts({
  //         product: whishlistdata,
  //         userId: "unauthenticated",
  //       })
  //     );
  //   }
  // }, [dispatch, userdetails, whishlistdata]);

  useEffect(() => {
    const isEmptyUserDetails =
      !userdetails || Object.keys(userdetails).length === 0;
    const userId = isEmptyUserDetails ? "unauthenticated" : userdetails._id;

    Promise.all([
      dispatch(
        fetchWishlistProducts({
          product: isEmptyUserDetails ? whishlistdata : [],
          userId,
        })
      ),
      dispatch(
        fetchWishlistDotProducts({
          product: isEmptyUserDetails ? whishlistdata : [],
          userId,
        })
      ),
      dispatch(
        fetchWishlistCustomizedProducts({
          product: isEmptyUserDetails ? whishlistdata : [],
          userId,
        })
      ),
      dispatch(
        fetcCustomizedComboProductsForWishlist({
          product: isEmptyUserDetails ? whishlistdata : [],
          userId,
        })
      ),
    ]);
  }, [dispatch, userdetails, whishlistdata]);

  useEffect(() => {
    if (
      loading === "fulfilled" &&
      Object.keys(userdetails)?.length > 0 &&
      products &&
      wishlistProducts &&
      dotProducts &&
      wishlistDotProducts &&
      wishlistCustomizedProducts &&
      customizedProducts &&
      wishlistCustomizedComboProducts &&
      customizedComboForWishlist
    ) {
      setProductCombinations(products);
      setSingleProductWishlist(wishlistProducts);
      setDotProduct(dotProducts);
      setDotProductWishlist(wishlistDotProducts);
      // setCustomizeProducts(customizedProducts);
      setCustomizeProductWishlist(wishlistCustomizedProducts);
      setCustomizeComboProductWishlist(wishlistCustomizedComboProducts);
      setCustomizeComboProduct(customizedComboForWishlist);
    } else if (
      userdetails &&
      Object.keys(userdetails)?.length === 0 &&
      whishlistdata &&
      wishlistProducts &&
      products &&
      dotProducts &&
      wishlistCustomizedProducts &&
      customizedProducts
    ) {
      setProductCombinations(products);
      setSingleProductWishlist(wishlistProducts);
      setDotProduct(dotProducts);
      setDotProductWishlist(wishlistDotProducts);
      // setCustomizeProducts(customizedProducts);
      setCustomizeProductWishlist(wishlistCustomizedProducts);
    }
  }, [
    loading,
    userdetails,
    products,
    wishlistProducts,
    whishlistdata,
    dotProducts,
    wishlistDotProducts,
    wishlistCustomizedProducts,
    customizedProducts,
    wishlistCustomizedComboProducts,
    customizedComboForWishlist,
  ]);

  /**get all wishlist customized combo products */
  // useEffect(() => {
  //   const fetchCustomizeComboProduct = async () => {
  //     try {
  //       const { data } = await axiosInstance.get(
  //         `/api/customized-combo-product/get-all-wishlist?filter=${JSON.stringify(
  //           whishlistdata
  //         )}`,
  //         {
  //           headers: {
  //             token: localStorage.getItem("token"),
  //           },
  //         }
  //       );
  //       if (data?.success) {
  //         setCustomizeComboProductCombinations(data?.data);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchCustomizeComboProduct();
  // }, [whishlistdata]);

  //   if (loading === "pending") {
  //   return <Preloader />;
  // }

  console.log("customizeComboProduct", customizeComboProduct);
  console.log("customizeComboProduct", customizeComboProduct);

  return (
    <>
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
            textTransform: "uppercase",
            fontSize: "30px",
          }}
        >
          Our Wishlist
        </h3> */}
      </div>{" "}
      {/* <div className="container my-5">
        <div className="row">
            <h1 className='text-center'>Whislist Product </h1>
            <div className="col-md-12">
            {
                allwhislistdata && allwhislistdata.map((p)=>{
                  return  <ProductCard product={p} key={p._id} addwhislist="Add" />
                })
            }
            </div>
        </div>
    </div> */}
      <div
        className="row "
        style={{ padding: "0px 0px 20px 0px", backgroundColor: "#fff" }}
      >
        {/* <p style={{ color: "#818181", textAlign: "center" }}>Our Products</p> */}
        {/* <h1 style={{ textAlign: "center", textTransform: "uppercase" }}>
          Whislist Product
        </h1> */}
        {productCombinations.length === 0 &&
          customizeProductWishlist?.length === 0 &&
          dotProduct?.length === 0 &&
          customizeComboProduct === 0 && (
            <>
              <br></br>
              <br></br>
              <center>
                <h6
                  className="text-center"
                  style={{
                    backgroundColor: "rgb(255,0,0,0.5)",
                    width: "20%",
                    borderRadius: "10px",
                    padding: "12px",
                    marginTop: "20px",
                  }}
                >
                  Whishlist Empty !!!
                </h6>
              </center>
            </>
          )}
        <div className="col-lg-12">
          {/* single Product Card */}
          {productCombinations &&
            productCombinations?.length > 0 &&
            productCombinations?.map((combination) => (
              <ProductCard
                key={combination._id}
                product={combination?.singleProductId}
                colnumber={3}
                customizedproductcardheight={"38vh"}
                // collectionUrl={collectiondetails?.url}
                combinationImage={combination?.image}
                productCombination={combination}
                wishlistData={singleProductWishlist || []}
                isProductInWishlist={isSingleProductInWishlist}
                isWishlist={true}
              />
            ))}

          {/* customized  Product Card */}
          {customizeProductWishlist &&
            customizeProductWishlist?.length > 0 &&
            customizeProductWishlist.map((combination) => (
              <CustomizeProductCard
                key={combination?._id}
                calculateCustomizedPrice={calculateCustomizedPrice}
                product={combination?.customizeProduct}
                colnumber={3}
                collectionUrl=""
                customizedproductcardheight={"38vh"}
                productCombination={combination?.customizeProduct}
                combination={combination}
                collectionname=""
                wishlistData={combination || []}
                isProductInWishlist={isCustomizedProductInWishlist}
                isWishlist={true}
              />
            ))}

          {dotProduct &&
            dotProduct?.length > 0 &&
            dotProduct?.map((p, index) =>
              p?.type === "singleDotProduct" ? (
                <div key={index} className="col-lg-6" style={{ float: "left" }}>
                  <DotProductCardRoomIdea
                    key={p._id}
                    dotproduct={p}
                    wishlistData={dotProductWishlist || []}
                    isProductInWishlist={isSingleDotProductInWishlist}
                    isWishlist={true}
                  />
                </div>
              ) : (
                <div className="col-lg-6" style={{ float: "left" }} key={index}>
                  <DotCustomizeProductCardRoomIdea
                    key={p._id}
                    dotproduct={p}
                    wishlistData={dotProductWishlist || []}
                    isProductInWishlist={isCustomizedDotProductInWishlist}
                    isWishlist={true}
                  />
                </div>
              )
            )}

          {customizeComboProduct &&
            customizeComboProduct?.length > 0 &&
            [].map((p) => (
              <CustomizedCombinationCard
                id={p?._id}
                product={p}
                Name={"p.name"}
                Image={"p.ProductImage"}
                Dots={"p.dots"}
                key={p?._id}
                selectedCustomizedProduct={p?.rectangles}
                // setTotalPrice={setTotalPrice}
              />
            ))}
        </div>
      </div>
      <MainFooter />
    </>
  );
};

export default Whislist;
