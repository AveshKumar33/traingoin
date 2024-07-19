import React, { useEffect, useReducer } from "react";
// import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Preloader from "../../../components/preloader/Preloader";
// import { IoLogIn } from "react-icons/io5";
// import { FaFacebook } from "react-icons/fa";
import { Box, Tab, Tabs, Slide } from "@mui/material";
import PropTypes from "prop-types";

import HeaderImage from "../../../assets/Image/Slider11.jpg";
// import MainFooter from "../../../components/mainfooter/MainFooter";
// import ProductCard from "../../../components/productcard/ProductCard";
// import { DotProductcard } from "../roomideas/RoomIdea";
import { getArchitectByUrl } from "../../../redux/slices/architectSlice";
// import { CiFacebook } from "react-icons/ci";
// import { FaXTwitter } from "react-icons/fa6";
// import { FaGooglePlusG, FaCity } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { BsFillTelephoneFill } from "react-icons/bs";
import { REACT_APP_URL } from "../../../config";
import "./style.css";

import {
  fetchWishlistProducts,
  fetchWishlistDotProducts,
  fetcCustomizedComboProductsForWishlist,
  fetchWishlistCustomizedProducts,
  fetchWishlistSingleProducts,
  fetchDotProductsWishlist,
  fetchCustomizedProductsWishlist,
  fetchCustomizedComboProductsWishlist,
} from "../../../redux/slices/newWishlistSlice";

import {
  getCartSingleProduct,
  getCartCustomizeProduct,
  getCartCustomizeComboProduct,
} from "../../../redux/slices/newCartSlice";

import { getPriceForWishlist } from "../../../utils/varientimge/getPrice";
import ProductCard from "../../../components/productcard/ProductCard";
import CustomizeCombinationCard from "../whislist/CustomizedCombinationCard";
import CustomizeProductCard from "../whislist/CustomizedProductCard";
import DotProductCardRoomIdea from "../roomideas/DotProductCardRoomIdea";
import DotCustomizeProductCardRoomIdea from "../roomideas/DotCustomizeProductCardRoomIdea";

import { isSingleProductInWishlist } from "../../../utils/isInWishlist/isSingleProduct";
import {
  isCustomizedDotProductInWishlist,
  isSingleDotProductInWishlist,
} from "../../../utils/isInWishlist/isSingleProduct";
import { isCustomizedProductInWishlist } from "../../../utils/isInWishlist/isCustomizedProduct";

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

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Slide direction="left" in={value === index} timeout={500}>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    </Slide>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const initialState = {
  architect: null,
  userDetails: null,
  productCombinations: [],
  singleProductWishlists: [],
  dotProduct: [],
  dotProductWishlists: [],
  customizeProductWishlist: [],
  customizeWishlist: [],
  customizeComboProduct: [],
  customizeComboWishlist: [],
  cartSingleProducts: [],
  cartCustomizeProducts: [],
  cartCustomizeComboProducts: [],
  value: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ARCHITECT":
      return { ...state, architect: action.payload };
    case "SET_USER_DETAILS":
      return { ...state, userDetails: action.payload };
    case "SET_SINGLE_PRODUCT":
      return { ...state, productCombinations: action.payload };
    case "SET_SINGLE_PRODUCT_WISHLIST":
      return { ...state, singleProductWishlists: action.payload };
    case "SET_DOT_PRODUCT":
      return { ...state, dotProduct: action.payload };
    case "SET_DOT_PRODUCT_WISHLIST":
      return { ...state, dotProductWishlists: action.payload };
    case "SET_CUSTOMIZE_PRODUCT":
      return { ...state, customizeProductWishlist: action.payload };
    case "SET_CUSTOMIZE_PRODUCT_WISHLIST":
      return { ...state, customizeWishlist: action.payload };
    case "SET_COMBO_PRODUCT":
      return { ...state, customizeComboProduct: action.payload };
    case "SET_COMBO_WISHLIST":
      return { ...state, customizeComboWishlist: action.payload };
    case "SET_CART_SINGLE_PRODUCT":
      return { ...state, cartSingleProducts: action.payload };
    case "SET_CART_CUSTOMIZE_PRODUCT":
      return { ...state, cartCustomizeProducts: action.payload };
    case "SET_CART_CUSTOMIZE_COMBO_PRODUCT":
      return { ...state, cartCustomizeComboProducts: action.payload };
    case "SET_VALUE":
      return { ...state, value: action.payload };
    default:
      return state;
  }
};

const ArchitectPage = () => {
  const { url } = useParams();

  const { loading, architectsdetails } = useSelector(
    (state) => state.architect
  );

  const {
    loading: wishlistProductLoading,
    singleProductLoading,
    dotProductLoading,
    customizeProductLoading,
    comboProductLoading,
    products,
    dotProducts,
    customizedComboForWishlist,
    wishlistCustomizedProducts,
    singleProductWishlist,
    dotProductWishlist,
    customizedProductWishlist,
    customizedComboWishlist,
  } = useSelector((state) => state.wishlist);

  const dispatch = useDispatch();
  const [state, dispatchState] = useReducer(reducer, initialState);
  const {
    architect,
    userDetails,
    productCombinations,
    dotProduct,
    customizeComboProduct,
    customizeProductWishlist,
    value,
    singleProductWishlists,
    dotProductWishlists,
    customizeWishlist,
    customizeComboWishlist,
    cartSingleProducts,
    cartCustomizeProducts,
    cartCustomizeComboProducts,
  } = state;

  const { userdetails, loading: userLoading } = useSelector(
    (state) => state.auth
  );

  const {
    cartSingleProduct,
    cartSingleLoading,
    cartCustomizeProduct,
    cartCustomizeProductLoading,
    cartCustomizeComboProduct,
    cartCustomizeComboProductLoading,
  } = useSelector((state) => state.newCartSlice);

  const { whishlistdata } = useSelector((state) => state.whishlist);

  const handleChange = (event, newValue) => {
    dispatchState({ type: "SET_VALUE", payload: newValue });
  };

  useEffect(() => {
    dispatch(getArchitectByUrl(url));
  }, [dispatch, url]);

  useEffect(() => {
    if (loading === "fulfilled" && architectsdetails) {
      dispatchState({ type: "SET_ARCHITECT", payload: architectsdetails });
    }
  }, [loading, architectsdetails]);

  useEffect(() => {
    if (userLoading === "fulfilled" && userdetails) {
      dispatchState({ type: "SET_USER_DETAILS", payload: userdetails });
    }
  }, [userLoading, userdetails]);

  useEffect(() => {
    if (architect && Object.keys(architect).length > 0) {
      Promise.all([
        dispatch(
          fetchWishlistProducts({
            product: [],
            userId: architect?._id,
          })
        ),
        dispatch(
          fetchWishlistDotProducts({
            product: [],
            userId: architect?._id,
          })
        ),
        dispatch(
          fetchWishlistCustomizedProducts({
            product: [],
            userId: architect?._id,
          })
        ),
        dispatch(
          fetcCustomizedComboProductsForWishlist({
            product: [],
            userId: architect?._id,
          })
        ),
      ]);
    }
  }, [architect, dispatch]);

  // fetch cart or wishlist
  useEffect(() => {
    if (userDetails && Object.keys(userDetails).length > 0) {
      Promise.all([
        dispatch(
          fetchWishlistSingleProducts({
            userId: userDetails?._id,
          })
        ),
        dispatch(
          fetchDotProductsWishlist({
            userId: userDetails?._id,
          })
        ),
        dispatch(
          fetchCustomizedProductsWishlist({
            userId: userDetails?._id,
          })
        ),
        dispatch(
          fetchCustomizedComboProductsWishlist({
            userId: userDetails?._id,
          })
        ),

        // for cart data
        dispatch(getCartSingleProduct({ id: userDetails?._id })),
        dispatch(getCartCustomizeProduct({ id: userDetails?._id })),
        dispatch(getCartCustomizeComboProduct({ id: userDetails?._id })),
      ]);
    }
  }, [userDetails, dispatch]);

  // set single cart product
  useEffect(() => {
    if (cartSingleLoading === "fulfilled" && cartSingleProduct) {
      dispatchState({
        type: "SET_CART_SINGLE_PRODUCT",
        payload: cartSingleProduct,
      });
    }
  }, [cartSingleLoading, cartSingleProduct]);

  // set customize cart product
  useEffect(() => {
    if (cartCustomizeProductLoading === "fulfilled" && cartCustomizeProduct) {
      dispatchState({
        type: "SET_CART_CUSTOMIZE_PRODUCT",
        payload: cartCustomizeProduct,
      });
    }
  }, [cartCustomizeProductLoading, cartCustomizeProduct]);

  // set customize combo cart product
  useEffect(() => {
    if (
      cartCustomizeComboProductLoading === "fulfilled" &&
      cartCustomizeComboProduct
    ) {
      dispatchState({
        type: "SET_CART_CUSTOMIZE_COMBO_PRODUCT",
        payload: cartCustomizeComboProduct,
      });
    }
  }, [cartCustomizeComboProduct, cartCustomizeComboProductLoading]);

  // set dot product
  useEffect(() => {
    if (wishlistProductLoading === "fulfilled" && dotProducts) {
      dispatchState({
        type: "SET_DOT_PRODUCT",
        payload: dotProducts,
      });
    }
  }, [wishlistProductLoading, dotProducts]);

  // set dot Product Wishlist
  useEffect(() => {
    if (
      userDetails &&
      Object.keys(userDetails).length > 0 &&
      wishlistProductLoading === "fulfilled" &&
      dotProductWishlist
    ) {
      dispatchState({
        type: "SET_DOT_PRODUCT_WISHLIST",
        payload: dotProductWishlist,
      });
    }
  }, [wishlistProductLoading, dotProductWishlist, userDetails]);

  // set customize product
  useEffect(() => {
    if (wishlistProductLoading === "fulfilled" && wishlistCustomizedProducts) {
      dispatchState({
        type: "SET_CUSTOMIZE_PRODUCT",
        payload: wishlistCustomizedProducts,
      });
    }
  }, [wishlistProductLoading, wishlistCustomizedProducts]);

  // set customize Product Wishlist
  useEffect(() => {
    if (
      userDetails &&
      Object.keys(userDetails).length > 0 &&
      wishlistProductLoading === "fulfilled" &&
      customizedProductWishlist
    ) {
      dispatchState({
        type: "SET_CUSTOMIZE_PRODUCT_WISHLIST",
        payload: customizedProductWishlist,
      });
    }
  }, [wishlistProductLoading, customizedProductWishlist, userDetails]);

  // set single Product
  useEffect(() => {
    if (wishlistProductLoading === "fulfilled" && products) {
      dispatchState({ type: "SET_SINGLE_PRODUCT", payload: products });
    }
  }, [wishlistProductLoading, products]);

  // set single Product Wishlist
  useEffect(() => {
    if (
      userDetails &&
      Object.keys(userDetails).length > 0 &&
      wishlistProductLoading === "fulfilled" &&
      singleProductWishlist
    ) {
      dispatchState({
        type: "SET_SINGLE_PRODUCT_WISHLIST",
        payload: singleProductWishlist,
      });
    }
  }, [wishlistProductLoading, singleProductWishlist, userDetails]);

  // set combo product
  useEffect(() => {
    if (wishlistProductLoading === "fulfilled" && customizedComboForWishlist) {
      dispatchState({
        type: "SET_COMBO_PRODUCT",
        payload: customizedComboForWishlist,
      });
    }
  }, [wishlistProductLoading, customizedComboForWishlist]);

  // set single Product Wishlist
  useEffect(() => {
    if (
      userDetails &&
      Object.keys(userDetails).length > 0 &&
      wishlistProductLoading === "fulfilled" &&
      customizedComboWishlist
    ) {
      dispatchState({
        type: "SET_COMBO_WISHLIST",
        payload: customizedComboWishlist,
      });
    }
  }, [wishlistProductLoading, customizedComboWishlist, userDetails]);

  // if logout set all customize product
  useEffect(() => {
    if (!userDetails && whishlistdata?.length > 0) {
      const singleProducts = [];
      const customizedProducts = [];
      const dotProducts = [];
      const comboProducts = [];

      for (let product of whishlistdata) {
        if (product?.singleProductId) {
          singleProducts.push(product);
        } else if (product?.customizedProductId) {
          customizedProducts.push(product);
        } else if (
          product?.customizeDotProductId ||
          product?.singleDotProductId
        ) {
          dotProducts.push(product);
        } else if (product?.customizedComboId) {
          comboProducts.push(product);
        }
      }

      dispatchState({
        type: "SET_SINGLE_PRODUCT_WISHLIST",
        payload: singleProducts,
      });

      dispatchState({
        type: "SET_CUSTOMIZE_PRODUCT_WISHLIST",
        payload: customizedProducts,
      });

      dispatchState({
        type: "SET_DOT_PRODUCT_WISHLIST",
        payload: dotProducts,
      });

      dispatchState({
        type: "SET_COMBO_WISHLIST",
        payload: comboProducts,
      });
    }
  }, [whishlistdata, userDetails]);

  // const handleKeyDown = (event) => {
  //   if (event.key === "ArrowRight") {
  //     dispatchState({ type: "SET_VALUE", payload: value < 3 ? value + 1 : 0 });
  //   } else if (event.key === "ArrowLeft") {
  //     dispatchState({ type: "SET_VALUE", payload: value > 0 ? value - 1 : 3 });
  //   }
  // };

  if (loading === "pending") {
    return <Preloader />;
  }

  return (
    <>
      <section>
        <div className="row">
          {/* <div className="col-md-3"></div> */}
          <div className="col-md-12">
            <div className="card profile_card">
              <div
                className="div"
                style={{
                  height: "30vh",
                  overflow: "hidden",
                  position: "relative",
                  background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(${HeaderImage})`,
                  backgroundSize: "cover",
                }}
              ></div>
              <div className="profile-thumb-block">
                <img
                  src={`${REACT_APP_URL}/images/architect/${architect?.image}`}
                  style={{ width: "130px", height: "125px" }}
                  alt="profile_image"
                  className="profile"
                />
              </div>
              <div className="card-content">
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                    letterSpacing: "2px",
                  }}
                >
                  {architect?.Name}
                </div>
                <br></br>
                <div className="contact-info">
                  <a
                    href={`mailto:${architect?.Email}`}
                    style={{ color: "#475B52", fontWeight: "600" }}
                  >
                    <span
                      style={{
                        border: "1px solid #475B52",
                        borderRadius: "50%",
                        padding: "7px 5px 7px 5px",
                      }}
                    >
                      <IoIosMail
                        style={{ color: "#475B52", fontSize: "24px" }}
                      />
                    </span>{" "}
                    {architect?.Email}
                  </a>{" "}
                  &nbsp;
                  <a
                    href={`tel:+${architect?.MobNumber}`}
                    style={{ color: "#475B52", fontWeight: "600" }}
                  >
                    <span
                      style={{
                        border: "1px solid #475B52",
                        borderRadius: "50%",
                        padding: "5px 5px 5px 5px",
                      }}
                    >
                      <BsFillTelephoneFill
                        style={{ color: "#475B52", fontSize: "18px" }}
                      />
                    </span>{" "}
                    {architect?.MobNumber}
                  </a>
                </div>
                {/* <div className="icon-block">
                    <a href="facebook.com">
                      <FaFacebook  style={{color:"#1877F2", fontSize:"24px"}} />
                    </a>
                    <a href="twitter.com">
                      <FaXTwitter
                       style={{color:"#000", fontSize:"20px"}}
                        title="Twitter"
                      />
                    </a>
                    <a href="google.com">
                      <FaGooglePlusG
                       style={{color:"red", fontSize:"26px"}}
                      />
                    </a>
                    <a href="/login">
                      <IoLogIn
                       style={{color:"#000", fontSize:"26px"}}
                      />
                    </a>
                  </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 
      <div className="box">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 ">
              <div className="box-part text-center ">
                <FaCity style={{ fontSize: "2rem" }} />

                <div className="title">
                  <h4>Address</h4>
                </div>

                <div className="text">
                  <span>
                    {architect?.Address} Lorem ipsum dolor sit amet, id quo
                    eruditi eloquentiam. Assum decore te sed. Elitr scripta
                    ocurreret qui ad.
                  </span>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12  ">
              <div className="box-part text-center">
                <ImOffice style={{ fontSize: "2rem" }} />

                <div className="title">
                  <h4>Company</h4>
                </div>

                <div className="text">
                  <span>
                    Lorem ipsum dolor sit amet, id quo eruditi eloquentiam.
                    Assum decore te sed. Elitr scripta ocurreret qui ad.
                  </span>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 ">
              <div className="box-part text-center">
                <TbSteam style={{ fontSize: "2rem" }} />

                <div className="title">
                  <h4>Benefits Provided</h4>
                </div>

                <div className="text">
                  <span>
                    Lorem ipsum dolor sit amet, id quo eruditi eloquentiam.
                    Assum decore te sed. Elitr scripta ocurreret qui ad.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       */}

      <Box sx={{ width: "100%" }} tabIndex={0}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            backgroundColor: "#45584F",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            aria-label="secondary tabs example"
            centered
            allowScrollButtonsMobile
          >
            <Tab
              label="Single Product"
              {...a11yProps(0)}
              style={{ color: "#fff" }}
            />
            <Tab
              label="Dot Product"
              {...a11yProps(1)}
              style={{ color: "#fff" }}
            />
            <Tab
              label="Customize Product"
              {...a11yProps(2)}
              style={{ color: "#fff" }}
            />
            <Tab
              label="Customize Combo"
              {...a11yProps(3)}
              style={{ color: "#fff" }}
            />
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0}>
          {singleProductLoading !== "pending" ? (
            productCombinations &&
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
                wishlistData={singleProductWishlists || []}
                isProductInWishlist={isSingleProductInWishlist}
                isWishlist={false}
                isArchitect={true}
                architectId={architect?._id}
                cartData={cartSingleProducts || []}
              />
            ))
          ) : (
            <div
              style={{
                width: "100vw",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Preloader />
            </div>
          )}
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          {dotProductLoading !== "pending" ? (
            dotProduct &&
            dotProduct?.length > 0 &&
            dotProduct?.map((p, index) =>
              p?.type === "singleDotProduct" ? (
                <div key={index} className="col-lg-6" style={{ float: "left" }}>
                  <DotProductCardRoomIdea
                    key={p._id}
                    dotproduct={p}
                    wishlistData={dotProductWishlists || []}
                    isProductInWishlist={isSingleDotProductInWishlist}
                    isWishlist={false}
                    isArchitect={true}
                  />
                </div>
              ) : (
                <div className="col-lg-6" style={{ float: "left" }} key={index}>
                  <DotCustomizeProductCardRoomIdea
                    key={p._id}
                    dotproduct={p}
                    wishlistData={dotProductWishlists || []}
                    isProductInWishlist={isCustomizedDotProductInWishlist}
                    isWishlist={false}
                    isArchitect={true}
                  />
                </div>
              )
            )
          ) : (
            <div
              style={{
                width: "100vw",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Preloader />
            </div>
          )}
        </CustomTabPanel>

        <CustomTabPanel value={value} index={2}>
          {customizeProductLoading !== "pending" ? (
            customizeProductWishlist &&
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
                wishlistData={customizeWishlist || []}
                isProductInWishlist={isCustomizedProductInWishlist}
                isWishlist={false}
                isArchitect={true}
                cartData={cartCustomizeProducts || []}
                architectId={architect?._id}
              />
            ))
          ) : (
            <div
              style={{
                width: "100vw",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Preloader />
            </div>
          )}
        </CustomTabPanel>

        <CustomTabPanel value={value} index={3}>
          {comboProductLoading !== "pending" ? (
            customizeComboProduct &&
            customizeComboProduct?.length > 0 &&
            customizeComboProduct.map((p) => (
              <CustomizeCombinationCard
                id={p?.customizedComboId?._id}
                product={p?.customizedComboId}
                key={p?._id}
                selectedCustomizedProduct={p?.customizedComboRectangle}
                wishlistData={customizeComboWishlist || []}
                data={p}
                isArchitect={true}
                architectId={architect?._id}
                cartData={cartCustomizeComboProducts || []}
              />
            ))
          ) : (
            <div
              style={{
                width: "100vw",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Preloader />
            </div>
          )}
        </CustomTabPanel>
      </Box>
    </>
  );
};

export default ArchitectPage;
