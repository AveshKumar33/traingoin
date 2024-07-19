import React, { useEffect, useState, useReducer, useCallback } from "react";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import HomeIcon from "@mui/icons-material/Home";
// import Footer from "../../../components/footer/Footer";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCartSingleProduct,
  getCartCustomizeProduct,
} from "../../../redux/slices/newCartSlice";

import ProductCard from "../../../components/productcard/ProductCard";
import CustomizeProductCard from "../../../components/productcard/CustomizeProductCard";
import "./collection.css";
import { axiosInstance } from "../../../config";
import { toastError } from "../../../utils/reactToastify";
import Preloader from "../../../components/preloader/Preloader";
import { getPriceForCollectionClient } from "../../../utils/varientimge/getPrice";
import { REACT_APP_URL } from "../../../config";
import { fetchWishlistForProductList } from "../../../redux/slices/newWishlistSlice";
import { isSingleProductInWishlist } from "../../../utils/isInWishlist/isSingleProduct";
import { isCustomizedProductInWishlist } from "../../../utils/isInWishlist/isCustomizedProduct";
// import ProductFilter from "../../../components/SideFilter/ProductFilter";
import ClientCollectionCard from "./ClientCollectionCard";
import "./ClientCollectionCard.css";
import { reducer, initialState, ActionTypes } from "./collectionReducer";

const calculateCustomizedPrice = (productDetails, combinations, priceFor) => {
  if (productDetails && combinations?.length > 0) {
    const { DefaultWidth, DefaultHeight } = productDetails || {};

    const totalCustomizedPrice =
      productDetails[priceFor] +
      getPriceForCollectionClient(productDetails, combinations, {
        DefaultWidth: DefaultWidth ? DefaultWidth : 0,
        DefaultHeight: DefaultHeight ? DefaultHeight : 0,
      });

    return totalCustomizedPrice;
  }
  return 0;
};

const ClientCollection = () => {
  const { wishlistProducts } = useSelector((state) => state.wishlist);
  const { whishlistdata } = useSelector((state) => state.whishlist);
  const { cartdata } = useSelector((state) => state.cart);

  const {
    cartSingleProduct,
    cartSingleLoading,
    cartCustomizeProduct,
    cartCustomizeProductLoading,
  } = useSelector((state) => state.newCartSlice);

  const { collectionname } = useParams();

  const [state, dispatchState] = useReducer(reducer, initialState);

  const {
    cartSingleProducts,
    cartCustomizeProducts,
    allChildCollections,
    collectiondetails,
    productCombinations,
    customizeProductCombinations,
  } = state;

  const [wishlistData, setWishlistData] = useState({
    singleProducts: [],
    customizedProducts: [],
  });

  const [loading, setLoading] = useState(false);
  const { userdetails } = useSelector((state) => state.auth);
  //Minnmium and maximum price
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    if (userdetails && Object.keys(userdetails).length > 0) {
      Promise.all([
        dispatch(fetchWishlistForProductList()),
        dispatch(getCartSingleProduct({ id: userdetails?._id })),
        dispatch(getCartCustomizeProduct({ id: userdetails?._id })),
      ]);
    }
  }, [dispatch, userdetails]);

  useEffect(() => {
    if (
      wishlistProducts &&
      userdetails &&
      Object.keys(userdetails).length > 0
    ) {
      const singleProducts = [];
      const customizedProducts = [];

      for (let product of wishlistProducts) {
        if (product?.singleProductId) {
          singleProducts.push(product);
        } else if (product?.customizedProductId) {
          customizedProducts.push(product);
        }
      }

      setWishlistData({ singleProducts, customizedProducts });
    } else if (
      whishlistdata?.length > 0 &&
      userdetails &&
      Object.keys(userdetails).length === 0
    ) {
      const singleProducts = [];
      const customizedProducts = [];

      for (let product of whishlistdata) {
        if (product?.singleProductId) {
          singleProducts.push(product);
        } else if (product?.customizedProductId) {
          customizedProducts.push(product);
        }
      }
      setWishlistData({ singleProducts, customizedProducts });
    }
  }, [wishlistProducts, userdetails, whishlistdata]);

  const fetchData = useCallback(async (url) => {
    try {
      setLoading(true);
      const [collectionDetailsResponse, customizeProductCombinationsresponse] =
        await Promise.all([
          axiosInstance.get(`/api/collection/collectiondetails/${url}`),
          axiosInstance.get(
            `/api/collection/collectiondetails/customize/${url}`
          ),
        ]);

      if (collectionDetailsResponse?.data.success) {
        dispatchState({
          type: ActionTypes.SET_COLLECTION_DETAILS,
          payload: collectionDetailsResponse?.data?.data,
        });

        dispatchState({
          type: ActionTypes.SET_PRODUCT_COMBINATIONS,
          payload: collectionDetailsResponse?.data?.productsCombinations,
        });
      }

      if (customizeProductCombinationsresponse?.data?.success) {
        dispatchState({
          type: ActionTypes.SET_CUSTOMIZE_PRODUCT_COMBINATION,
          payload:
            customizeProductCombinationsresponse?.data
              ?.customizeProductsCombinations,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toastError(error?.response?.data?.message);
    }
  }, []);

  // fetching single product by url
  useEffect(() => {
    if (collectionname) {
      Promise.all([fetchData(collectionname)]);
    }
  }, [fetchData, collectionname]);

  useEffect(() => {
    if (
      cartSingleLoading === "fulfilled" &&
      cartSingleProduct &&
      userdetails &&
      Object.keys(userdetails).length > 0
    ) {
      dispatchState({
        type: ActionTypes.SET_CART_SINGLE_PRODUCT,
        payload: cartSingleProduct,
      });
    } else if (cartdata?.length > 0) {
      const singleProducts = [];
      const customizedProducts = [];

      for (let product of cartdata) {
        if (product?.singleProductId) {
          singleProducts.push(product);
        } else if (product?.customizedProductId) {
          customizedProducts.push(product);
        }
      }

      dispatchState({
        type: ActionTypes.SET_CART_SINGLE_PRODUCT,
        payload: singleProducts,
      });

      dispatchState({
        type: ActionTypes.SET_CART_CUSTOMIZE_PRODUCT,
        payload: customizedProducts,
      });
    }
  }, [cartSingleLoading, cartSingleProduct, userdetails, cartdata]);

  useEffect(() => {
    if (cartCustomizeProductLoading === "fulfilled" && cartCustomizeProduct) {
      dispatchState({
        type: ActionTypes.SET_CART_CUSTOMIZE_PRODUCT,
        payload: cartCustomizeProduct,
      });
    }
  }, [cartCustomizeProductLoading, cartCustomizeProduct]);

  const fetchAllChildCollection = async (id) => {
    const { data } = await axiosInstance.get(
      `/api/collection/get-all-child-collection/${id}`
    );
    if (data.success) {
      dispatchState({
        type: ActionTypes.SET_ALL_CHILD_COLLECTIONS,
        payload: data?.data,
      });
    }
  };

  useEffect(() => {
    if (collectiondetails?._id) {
      fetchAllChildCollection(collectiondetails?._id);
    }
  }, [collectiondetails]);

  // useEffect(() => {
  //   if (minprice && maxprice) {
  //     setfilteredProduct(
  //       product
  //         .filter((p) => p.CustomizedProduct === false)
  //         .filter(
  //           (p) => p.OriginalPrice >= minprice && p.OriginalPrice <= maxprice
  //         )
  //     );
  //   }
  // }, [minprice, maxprice]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <>
      <StickySidebar />
      {/* <MainHeader
        isImageAvailable={
          collectiondetails?.collectionHeaderImage?.pngImage ? true : false
        }
      /> */}
      <MainHeader
        isImageAvailable={
          collectiondetails?.collectionHeaderImage?.pngImage ? true : false
        }
      />
      <div
        className="div"
        style={{
          height: collectiondetails?.collectionHeaderImage?.pngImage
            ? "60vh"
            : "11vh",
          overflow: "hidden",
          position: "relative",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(${REACT_APP_URL}/images/header/${collectiondetails?.collectionHeaderImage?.pngImage})`,
          backgroundSize: "cover",
        }}
      ></div>
      <div className="row" style={{ padding: "20px 10px 0px 10px" }}>
        <div className="col-lg-12">
          <p className="mb-2" style={{ color: "#222" }}>
            <Link to={`/`} style={{ fontSize: 16, color: "#222" }}>
              <HomeIcon className="fa-solid fa-house-user" />
            </Link>{" "}
            &nbsp; &nbsp;
            {collectiondetails &&
              collectiondetails?.rootPath?.length > 0 &&
              collectiondetails?.rootPath?.map((collections, index) => (
                <React.Fragment key={index}>
                  <i className="fa fa-chevron-right" style={{ fontSize: 16 }} />
                  &nbsp;&nbsp;
                  <Link
                    to={`/collection/${collections.url}`}
                    style={{
                      fontWeight: "700",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      color: "#222",
                    }}
                  >
                    {collections?.title}
                  </Link>{" "}
                  &nbsp;
                </React.Fragment>
              ))}
            &nbsp;
            <i className="fa fa-chevron-right" style={{ fontSize: 16 }} />
            &nbsp; &nbsp;
            <Link
              style={{
                fontWeight: "700",
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "#222",
              }}
            >
              {collectiondetails?.url ? collectiondetails?.url : collectionname}
            </Link>{" "}
          </p>
        </div>
      </div>
      {/* {console.log("allChildCollections", allChildCollections)} */}
      <div className="row" style={{ paddingRight: "0px", paddingLeft: "0px" }}>
        {allChildCollections && allChildCollections.length > 0 && (
          <>
            <div
            // style={{
            //   background: "linear-gradient(to top, #F7F8FC, #ffffff)",
            // }}
            >
              <h3
                style={{
                  textTransform: "uppercase",
                  padding: "20px 0px 0px 20px",
                  fontWeight: "600",
                }}
              >
                Featured Categories
              </h3>
              <div
                className="row"
                style={{ paddingRight: "0px", paddingLeft: "0px" }}
              >
                {allChildCollections.map((collection) => (
                  <ClientCollectionCard p={collection} key={collection?._id} />
                ))}
              </div>
            </div>
            {/* <center><hr style={{width:"40%"}}></hr></center> */}
          </>
        )}
        <>
          <div
            className="row"
            style={{
              marginTop: "20px",
              paddingRight: "0px",
              paddingLeft: "0px",
            }}
          >
            <p
              style={{
                textAlign: "center",
                letterSpacing: "2px",
              }}
            >
              OUR COLLECTION
            </p>
            <h1 style={{ textAlign: "center", textTransform: "uppercase" }}>
              EXCLUSIVE DESIGN COLLECTIONS
            </h1>

            <div className="row pricesectionstyle">
              <form onSubmit={handleFilterSubmit}>
                <div
                  className="col-lg-4 col-12 pricesectionstyle"
                  style={{ float: "left" }}
                >
                  <div style={{ paddingLeft: "20px" }}>
                    <h6 className="labelcolor">Price Range</h6>
                    <div className="d-flex w-100">
                      <input
                        type="number"
                        className="form-control"
                        min={0}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />{" "}
                      <span
                        className="labelcolor"
                        style={{ margin: "0px 20px 0px 20px" }}
                      >
                        to
                      </span>{" "}
                      <input
                        className="form-control"
                        type="number"
                        min={0}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="col-lg-3 col-12 pricesectionstyle"
                  style={{ float: "left" }}
                >
                  <div className="pricesectionstyle1">
                    <h6 className="labelcolor">Sort By</h6>
                    <div className="d-flex w-100">
                      <select
                        id="inputState"
                        className="form-control"
                        // onChange={(e) => setsort(e.target.value)}
                      >
                        <option>Sort Products</option>
                        <option value="newest">Newest</option>
                        <option value="asc">Price (ASC)</option>
                        <option value="desc">Price (DESC)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <span className="col-lg-4 col-12 px-4">
                  <button
                    type="submit"
                    className="mt-4 btn"
                    style={{ backgroundColor: "#324A42", color: "#fff" }}
                  >
                    Apply
                  </button>
                </span>
              </form>
            </div>

            <div
              className="row"
              style={{
                paddingLeft: "0px",
                paddingRight: "0px",
                marginTop: "10px",
                marginLeft: "12px",
              }}
            >
              {/* {console.log("productCombinations", productCombinations)} */}
              {/* single Product Card */}
              {productCombinations &&
                productCombinations.length > 0 &&
                // <div className="row p-3">
                productCombinations.map((combination) => (
                  <ProductCard
                    key={combination._id}
                    product={combination?.singleProductId}
                    colnumber={3}
                    customizedproductcardheight={"38vh"}
                    collectionUrl={collectiondetails?.url}
                    combinationImage={combination?.image}
                    productCombination={combination}
                    collectionname={collectionname}
                    wishlistData={wishlistData?.singleProducts || []}
                    isProductInWishlist={isSingleProductInWishlist}
                    isWishlist={false}
                    cartData={cartSingleProducts || []}
                  />
                ))}
              {/* customized  Product Card */}
              {customizeProductCombinations &&
                customizeProductCombinations.length > 0 && (
                  // <div className="row p-3">
                  <>
                    {customizeProductCombinations.map((combination) => (
                      <CustomizeProductCard
                        key={combination?._id}
                        calculateCustomizedPrice={calculateCustomizedPrice}
                        product={combination?.productId}
                        colnumber={3}
                        collectionUrl={collectiondetails?.url}
                        customizedproductcardheight={"38vh"}
                        productCombination={combination?.productId}
                        combination={combination}
                        collectionname={collectionname}
                        wishlistData={wishlistData?.customizedProducts || []}
                        isProductInWishlist={isCustomizedProductInWishlist}
                        isWishlist={false}
                        cartData={cartCustomizeProducts || []}
                      />
                    ))}
                    {/* </div> */}
                  </>
                )}
            </div>
          </div>
        </>
        {/* ) : (
          <>
          <h4 className="text-center my-5"> No any Product found ! 😞</h4>
          </>
        )} */}
      </div>
      <br></br>
      <MainFooter />
    </>
  );
};

export default ClientCollection;
