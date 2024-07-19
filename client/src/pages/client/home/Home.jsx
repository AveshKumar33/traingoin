import React, { useReducer, useEffect, useState, useCallback } from "react";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import "./custom.css";
import "./header.css";
import { REACT_APP_URL } from "../../../config";
import { getPriceForCollectionClient } from "../../../utils/varientimge/getPrice";
import CustomizeProductCard from "../../../components/productcard/CustomizeProductCard";

import background1 from "../../../assets/Image/background1.jpg";

import { isSingleProductInWishlist } from "../../../utils/isInWishlist/isSingleProduct";
import { isCustomizedProductInWishlist } from "../../../utils/isInWishlist/isCustomizedProduct";

//New Product data
import productimg from "../../../assets/Image/Twin-Sleeper-Sofa.jpg";
import busimg from "../../../assets/Image/si1.png";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { axiosInstance } from "../../../config";
import ProductCard from "../../../components/productcard/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchdotProduct } from "../../../redux/slices/dotProductSliceNew";

import {
  getCartSingleProduct,
  getCartCustomizeProduct,
} from "../../../redux/slices/newCartSlice";

import { Link } from "react-router-dom";
import Preloader from "../../../components/preloader/Preloader";
import ProjectSlider from "./ProjectSlider";
import ClientCollectionCard from "../collection/ClientCollectionCard";
import CatalogueSlider from "./CatalogueSlider";
import ReviewsSlider from "./ReviewsSlider";
import { DotCusProductcard } from "./DotCusProductcard";
import { DotSingProductCard } from "./DotSingProductCard";
import { fetchWishlistForProductList } from "../../../redux/slices/newWishlistSlice";
import { toastError } from "../../../utils/reactToastify";
import FeelFreeToContactUs from "./FeelFreeToContactUs";

import { reducer, initialState, ActionTypes } from "./homeReducer";

const Home = () => {
  const dispatch = useDispatch();

  const { userdetails } = useSelector((state) => state.auth);
  const { wishlistProducts } = useSelector((state) => state.wishlist);
  const { whishlistdata } = useSelector((state) => state.whishlist);
  const [wishlistData, setWishlistData] = useState({
    singleProducts: [],
    customizedProducts: [],
  });

  const {
    cartSingleProduct,
    cartSingleLoading,
    cartCustomizeProduct,
    cartCustomizeProductLoading,
  } = useSelector((state) => state.newCartSlice);

  const [state, dispatchState] = useReducer(reducer, initialState);
  const {
    cartSingleProducts,
    cartCustomizeProducts,
    rootCollection,
    blogs,
    productCombinations,
    // allDotProducts,
    project,
    slider,
    Catalogue,
    mostSellingCollections,
    topFiveReviews,
    customizeProductCombinations,
    contactUs,
  } = state;

  // const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  /**calculate  Customized Price  */
  const calculateCustomizedPrice = (productDetails, combinations, priceFor) => {
    if (productDetails && combinations?.length > 0) {
      const { DefaultWidth, DefaultHeight } = productDetails || {};

      const totalCustomizedPrice =
        productDetails[priceFor] +
        getPriceForCollectionClient(productDetails, combinations, {
          DefaultWidth,
          DefaultHeight,
        });

      return totalCustomizedPrice;
    }
    return 0;
  };

  const fetchData = useCallback(async () => {
    try {
      const [
        blogResponse,
        // dotProductResponse,
        productCombinationsResponse,
        customizeProductCombinationsResponse,
        contactUsResponse,
        projectResponse,
        rootCollectionResponse,
        mostSellingCollectionsResponse,
        sliderResponse,
        catalogueResponse,
        topFiveReviewsResponse,
      ] = await Promise.all([
        axiosInstance.get("/api/blog"),
        // axiosInstance.get("/api/collection-filter/dot/products"),
        axiosInstance.get(`/api/product-new/get-all-feature-product`),
        axiosInstance.get(`/api/customized-product/get-all-feature-product`),
        axiosInstance.get(`/api/partner-with-us/contactUs/details`),
        axiosInstance.get(`/api/project?limit=${2}`),
        axiosInstance.get("/api/collection/getRootCollection"),
        axiosInstance.get(`/api/collection/most/selling`),
        axiosInstance.get("/api/slider"),
        axiosInstance.get("/api/catalogue"),
        axiosInstance.get("/api/review/top-five/reviews"),
      ]);

      if (blogResponse?.data?.success) {
        const blogData = blogResponse.data.blog;
        dispatchState({
          type: ActionTypes.SET_BLOGS,
          payload: blogData,
        });
      }

      // if (dotProductResponse?.data?.success) {
      //   const dotProducts = dotProductResponse.data.data;
      //   dispatchState({
      //     type: ActionTypes.SET_ALL_DOT_PRODUCTS,
      //     payload: dotProducts,
      //   });
      // }

      if (productCombinationsResponse?.data?.success) {
        dispatchState({
          type: ActionTypes.SET_PRODUCT_COMBINATIONS,
          payload: productCombinationsResponse?.data.data,
        });
      }

      if (customizeProductCombinationsResponse?.data?.success) {
        dispatchState({
          type: ActionTypes.SET_CUSTOMIZE_PRODUCT_COMBINATIONS,
          payload: customizeProductCombinationsResponse?.data.data,
        });
      }

      if (contactUsResponse?.data.success) {
        dispatchState({
          type: ActionTypes.SET_CONTACT_US,
          payload: contactUsResponse?.data.data,
        });
      }
      if (projectResponse?.data.success) {
        dispatchState({
          type: ActionTypes.SET_PROJECT,
          payload: projectResponse?.data.data,
        });
      }

      if (rootCollectionResponse?.data?.success) {
        dispatchState({
          type: ActionTypes.SET_ROOT_COLLECTION,
          payload: rootCollectionResponse?.data.data,
        });
      }

      if (mostSellingCollectionsResponse?.data?.success) {
        dispatchState({
          type: ActionTypes.SET_MOST_SELLING_COLLECTIONS,
          payload: mostSellingCollectionsResponse?.data.data,
        });
      }

      if (sliderResponse?.data?.success) {
        dispatchState({
          type: ActionTypes.SET_SLIDER,
          payload: sliderResponse?.data.data,
        });
      }

      if (catalogueResponse?.data?.success) {
        dispatchState({
          type: ActionTypes.SET_CATALOGUE,
          payload: catalogueResponse?.data.data,
        });
      }
      if (topFiveReviewsResponse?.data?.success) {
        dispatchState({
          type: ActionTypes.SET_TOP_FIVE_REVIEWS,
          payload: topFiveReviewsResponse?.data.data,
        });
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    const fetchDataAndDotProduct = async () => {
      try {
        setLoading(true);

        await Promise.all([dispatch(fetchdotProduct({})), fetchData()]);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAndDotProduct();
  }, [dispatch, fetchData]);

  useEffect(() => {
    if (userdetails && Object.keys(userdetails).length > 0) {
      Promise.all([
        dispatch(fetchWishlistForProductList()),
        dispatch(getCartSingleProduct({ id: userdetails?._id })),
        dispatch(getCartCustomizeProduct({ id: userdetails?._id })),
      ]);
    }
  }, [dispatch, userdetails]);

  // single cart
  useEffect(() => {
    if (cartSingleLoading === "fulfilled" && cartSingleProduct) {
      dispatchState({
        type: ActionTypes.SET_CART_SINGLE_PRODUCT,
        payload: cartSingleProduct,
      });
    }
  }, [cartSingleLoading, cartSingleProduct]);

  // customize cart
  useEffect(() => {
    if (cartCustomizeProductLoading === "fulfilled" && cartCustomizeProduct) {
      dispatchState({
        type: ActionTypes.SET_CART_CUSTOMIZE_PRODUCT,
        payload: cartCustomizeProduct,
      });
    }
  }, [cartCustomizeProductLoading, cartCustomizeProduct]);

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
      userdetails &&
      whishlistdata?.length > 0 &&
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

  if (loading) {
    return <Preloader />;
  }

  return (
    <>
      <StickySidebar />
      <MainHeader isImageAvailable={true} />
      <div
        className="row"
        style={{
          padding: "0 20 20 20",
          backgroundColor: "#fff",
        }}
      >
        <div className="col-lg-12" style={{ float: "left" }}>
          <div
            id="carouselExampleDarkDesktop HomeCarouselImageSectionHeight1"
            className="carousel carousel-dark slide "
            data-bs-ride="carousel"
          >
            <div className="carousel-inner HomeCarouselImageSectionHeight1">
              <CatalogueSlider slider={slider} />
            </div>
          </div>
        </div>
      </div>
      <div className="row" id="SecondSection">
        {mostSellingCollections &&
          mostSellingCollections.length > 0 &&
          mostSellingCollections.map((collection, index) => (
            <div
              key={index}
              className="col-lg-4 TopSectionImageheading SixImageSection"
              style={{
                float: "left",
                background: `linear-gradient(rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.5)), url(${`${REACT_APP_URL}/images/collection/${collection?.CollectionImage[0]}`})`,
                backgroundSize: "cover",
                backgroundPosition: "center",

                marginRight: "5px",
                marginTop: "5px",
              }}
            >
              <Link to={`/collection/${collection.url}`}>
                <h4>{collection.title}</h4>
              </Link>
            </div>
          ))}
      </div>
      <div
        className="row"
        style={{
          padding: "20px 0px 10px 0px",
          backgroundColor: "#fff",
        }}
      >
        <p
          style={{
            color: "#818181",
            textAlign: "center",
            letterSpacing: "2px",
          }}
        >
          OUR COLLECTION
        </p>
        <h1
          style={{ textAlign: "center", textTransform: "uppercase" }}
          // className="mb-5"
        >
          EXCLUSIVE DESIGN COLLECTIONS
        </h1>
        {rootCollection && rootCollection.length > 0 && (
          <div className="sub-channel sub-channel" style={{ padding: "0px" }}>
            <div className="sub-channel-list" style={{ padding: "0px" }}>
              {rootCollection.map((collection) => (
                <ClientCollectionCard p={collection} key={collection?._id} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div
        className="row "
        style={{
          padding: "20px 0px 20px 0px",
          background: "linear-gradient(to top, #ddd, #ffffff)",
        }}
      >
        <p style={{ color: "#818181", textAlign: "center" }}>Our Products</p>
        <h1
          style={{ textAlign: "center", textTransform: "uppercase" }}
          // className="mb-5"
        >
          Featured Product
        </h1>
        <br></br>
        <br></br>
        <div
          className="row FeaturedProductRowStyle"
          style={{
            paddingLeft: "0px !important",
            paddingRight: "0px !important",
            marginTop: "10px",
            marginLeft: "0px",
          }}
        >
          {/* single Product Card */}
          {
            productCombinations &&
              productCombinations.length > 0 &&
              productCombinations
                .slice(0, 3)
                .map((combination) => (
                  <ProductCard
                    key={combination._id}
                    product={combination?.singleProductId}
                    colnumber={3}
                    customizedproductcardheight={"38vh"}
                    collectionUrl={
                      combination?.singleProductId?.Collection[0].url
                    }
                    combinationImage={combination?.image}
                    productCombination={combination}
                    wishlistData={wishlistData?.singleProducts || []}
                    isProductInWishlist={isSingleProductInWishlist}
                    isWishlist={false}
                    cartData={cartSingleProducts || []}
                  />
                ))
            // </div>
          }
          {/* customized  Product Card */}
          {customizeProductCombinations &&
            customizeProductCombinations.length > 0 && (
              // <div className="row" style={{paddingLeft:"0px",paddingRight:"0px"}}>
              <>
                {customizeProductCombinations.slice(0, 3).map((combination) => (
                  <CustomizeProductCard
                    key={combination?._id}
                    calculateCustomizedPrice={calculateCustomizedPrice}
                    product={combination?.productId}
                    colnumber={3}
                    collectionUrl={combination?.productId?.Collection[0].url}
                    customizedproductcardheight={"38vh"}
                    productCombination={combination?.productId}
                    combination={combination}
                    wishlistData={wishlistData?.customizedProducts || []}
                    isProductInWishlist={isCustomizedProductInWishlist}
                    isWishlist={false}
                    cartData={cartCustomizeProducts || []}
                    // collectionname={collectionname}
                  />
                ))}
              </>
              // </div>
            )}
        </div>
      </div>{" "}
      {contactUs.contactUsImage &&
        Object.keys(contactUs).length > 0 &&
        Object.keys(contactUs.contactUsImage).length > 0 && (
          <div
            className="row feelfreetocontactusstyle"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8)), url(${REACT_APP_URL}/images/clientImages/${contactUs?.contactUsImage?.pwusImage})`,
              backgroundAttachment: "fixed",
              backgroundPosition: "center",
            }}
          >
            <div
              className="parallel-image-section"
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
                  <div className="col-lg-8" style={{ float: "left" }}>
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
      {/*
      <div
        className="row"
        style={{
          padding: "20px 0px 20px 0px",
          background: "linear-gradient(to top, #ddd, #ffffff)",
        }}
      >
        <p
          style={{
            color: "#818181",
            textAlign: "center",
            letterSpacing: "2px",
          }}
        >
          CONCEPTUAL IMAGES
        </p>
        <h1
          style={{ textAlign: "center", textTransform: "uppercase" }}
          className="mb-5"
        >
          Shop By Inspiration
        </h1>

        <div
          id="carouselExampleAutoplaying"
          className="carousel carousel-dark slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {allDotProducts &&
              allDotProducts.length > 0 &&
              allDotProducts.map((p, index) =>
                p?.type === "singleDotProduct" ? (
                  <DotSingProductCard
                    key={p._id}
                    dotproduct={p}
                    index={index}
                    total={allDotProducts.length}
                  />
                ) : (
                  <DotCusProductcard
                    key={p._id}
                    dotproduct={p}
                    index={index}
                    total={allDotProducts.length}
                  />
                )
              )}
          </div>
        </div>

      </div>
        */}
      <div
        className="row"
        style={{
          background: "linear-gradient(to top, #ddd, #ffffff)",
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        <p
          style={{
            color: "#000",
            textAlign: "center",
            letterSpacing: "2px",
          }}
        >
          Our Projects
        </p>
        <h1
          style={{ textAlign: "center", textTransform: "uppercase" }}
          className="mb-5"
        >
          Completed Projects
        </h1>

        <>
          {project &&
            project.length > 0 &&
            project.map((proj) => {
              return (
                <ProjectSlider key={proj._id} id={proj._id} project={proj} />
              );
            })}
        </>
      </div>
      <div
        className="row cataloguebackgroundheight"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.10)), url(${background1})`,
          backgroundPosition: "center",
        }}
      >
        <div className="parallel-image-section" style={{ paddingTop: "40px" }}>
          <div className="content">
            <center>
              <h1
                style={{
                  color: "#fff",
                  textTransform: "uppercase",
                  fontWeight: "500",
                }}
              >
                Our Catalogue
              </h1>
              <p className="cataloguecontent">
                Browse our curated catalog for inspiration and discover the
                perfect pieces to elevate your project.
              </p>
            </center>
            <br></br>
            <div className="container-fluid">
              {Catalogue &&
                Catalogue.length > 0 &&
                Catalogue?.slice(0, 4)?.map((catalogue, i) => (
                  <Link
                    key={i}
                    to={`${REACT_APP_URL}/images/catalogue/${catalogue?.pdfUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="col-lg-3" style={{ float: "left" }}>
                      <center>
                        <div className="col-lg-10">
                          <img
                            className="catalogueimage"
                            src={`${REACT_APP_URL}/images/catalogue/${catalogue?.image}`}
                            alt="_catalogue"
                            style={{
                              width: "100%",
                              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                            }}
                          />
                          <br></br>
                          <br></br>
                          <p
                            style={{
                              color: "#fff",
                              textTransform: "uppercase",
                              fontWeight: "600",
                              fontSize: "16px",
                            }}
                          >
                            {catalogue.name}
                          </p>
                        </div>
                      </center>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className="row"
        style={{
          background: "linear-gradient(to top, #ddd, #ffffff)",
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        <p
          style={{
            color: "#818181",
            textAlign: "center",
            letterSpacing: "2px",
          }}
        >
          Blogs
        </p>
        <h1 style={{ textAlign: "center", textTransform: "uppercase" }}>
          Our Blogs
        </h1>
        {blogs &&
          blogs.length > 0 &&
          blogs.slice(0, 2).map((blog, index) => (
            <div
              key={index}
              className="col-lg-6 d-flex justify-content-end"
              style={{
                // paddingRight: "2px",
                marginBottom: "20px",
                marginTop: "10px",
              }}
            >
              <div
                className="col-lg-11 custom-col1 completedprojectsheading1 blogsheight"
                style={{
                  background: `linear-gradient(rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.5)), url(${`${REACT_APP_URL}/images/blog/${blog?.FeaturedImage}`})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                }}
              >
                <h4 style={{ textAlign: "center" }}>
                  {blog.heading}
                  <br></br>
                  <br></br>
                  {/* <span
                    style={{
                      textAlign: "justify !important",
                      fontSize: "13.7px",
                      fontWeight: "100",
                      textTransform: "capitalize",
                    }}
                  >
                    {blog.content?.length > 210
                      ? blog.content.slice(0, 210)
                      : blog.description(0, 210)}
                  </span> */}
                  <p
                    style={{
                      fontSize: "18px",
                      letterSpacing: "1px",
                      textAlign: "justify",
                    }}
                  >
                    <span
                      style={{
                        textAlign: "justify !important",
                        fontSize: "13.7px",
                        fontWeight: "100",
                        textTransform: "capitalize",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: (blog?.content).slice(0, 95).trim(),
                      }}
                      className="productdescription"
                    />
                  </p>

                  <Link to={`single-blog/${blog?._id}`} style={{ zoom: "80%" }}>
                    <div
                      style={{
                        padding: "8px 20px 8px 20px",
                        backgroundColor: "#fff",
                        color: "#475B52",
                        borderRadius: "5px",
                        right: "0",
                        textTransform: "capitalize",
                      }}
                    >
                      Read More...
                    </div>
                  </Link>
                </h4>
              </div>
            </div>
          ))}
      </div>
      {contactUs.contactUsVideo &&
        Object.keys(contactUs).length > 0 &&
        Object.keys(contactUs.contactUsVideo).length > 0 && (
          <div
            className="row feelfreetocontactusstyle"
            style={{ position: "relative" }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: "-2",
                background:
                  "linear-gradient(rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.7))",
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
              className="parallel-image-section"
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
                  <div className="col-lg-8" style={{ float: "left" }}>
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
      <div
        className="row"
        style={{
          background: "linear-gradient(to top, #ddd, #ffffff)",
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        <p
          style={{
            color: "#818181",
            textAlign: "center",
            letterSpacing: "2px",
          }}
        >
          OUR CLIENTS
        </p>
        <h1
          className="whatourstyle"
          // className="mb-5"
        >
          WHAT OUR CLIENTS SAYS ?
        </h1>
        <ReviewsSlider reviews={topFiveReviews} />
      </div>
      {/* <div
        className="row justify-content-around ShopStyle"
        style={{ backgroundColor: "#fff" }}
      >
        <p style={{ color: "#818181", textAlign: "center" }}>
          Our Shopping Elevation
        </p>
        <h1 style={{ textAlign: "center", textTransform: "uppercase" }}>
          Shop By Elevation
        </h1>
        <br />
        <br />

        <div className="row">
          {dotproducts &&
            dotproducts?.length !== 0 &&
            dotproducts.slice(0, 2).map((p) => {
              return (
                <>
                  <DotProductcard key={p._id} dotproduct={p} />
                </>
              );
            })}

        </div>
        <div className="row">
          <div className="col-md-12 text-center">
            <Link
              to="/room-ideas"
              className="btn btn-primary text-center"
              style={{ backgroundColor: "#475B52", border: "none" }}
            >
              View More
            </Link>
          </div>
        </div>
      </div> */}
      {/* <br></br> */}
      {/* <Catalogue /> */}
      {/* Testimonial Section */}
      {/* 
      {reviewdata && reviewdata && reviewdata?.length !== 0 && (
        <ClientTestimonial reviewdata={reviewdata} />
      )} */}
      {/* Enquiry Form */}
      {/* <EnquiryForm /> */}
      {/* Footer Section */}
      <MainFooter />
    </>
  );
};

// const Collection = ({ name, img }) => {
//   return (
//     <>
//       <div className="col-lg-2" style={{ float: "left" }}>
//         <center>
//           <a href="#" style={{ textDecoration: "none", color: "black" }}>
//             <img
//               loading="lazy"
//               src={img}
//               style={{ height: "30vh", padding: 15 }}
//               alt="prev"
//             />
//             <p style={{ textAlign: "center" }}>{name}</p>
//           </a>
//         </center>
//       </div>
//     </>
//   );
// };

// const InteriorCollection = ({ name, img }) => {
//   return (
//     <>
//       <div
//         className="col-lg-4 content_img"
//         style={{ float: "left", marginTop: 30 }}
//       >
//         <img loading="lazy" src={img} className="section1" />
//         <div>{name}</div>
//       </div>
//     </>
//   );
// };

// const NbgSection = ({ name, img }) => {
//   return (
//     <>
//       <div className="col-lg-4" style={{ float: "left" }}>
//         <img loading="lazy" src={img} className="hoverGuides" alt="prev" />
//         <a href="#" style={{ color: "#000" }}>
//           {name}
//         </a>
//       </div>
//     </>
//   );
// };

export const NewProduct = () => {
  return (
    <>
      <div className="col-lg-3 productsectionstyle">
        <figure className="effect-zoe" style={{ backgroundColor: "#fff" }}>
          <img loading="lazy" src={productimg} alt="img25" />
          {/* <a
            className="View-image"
            href="SingleProduct.html"
            style={{ display: "inline" }}
          ></a> */}
          <figcaption onclick="openCart()">
            <h2 style={{ fontSize: 16, color: "#fff" }}>Add to Cart </h2>
            <p className="icon-links">
              <i
                className="fa-solid fa-cart-shopping"
                style={{ color: "#fff", cursor: "pointer" }}
              />
            </p>
          </figcaption>
        </figure>
        <h2
          style={{
            fontSize: 16,
            textAlign: "left",
            padding: "10px 10px 0px 10px",
          }}
        >
          Twin Sleeper Sofa
        </h2>
        <h2
          style={{
            fontSize: 16,
            textAlign: "left",
            padding: "10px 10px 0px 10px",
            color: "#bbb",
          }}
        >
          $199.00 &nbsp;&nbsp;<strike>$199.00</strike>
        </h2>
        <h2
          style={{
            fontSize: 16,
            textAlign: "left",
            padding: "10px 10px 0px 10px",
            color: "#bbb",
            fontWeight: 500,
          }}
        >
          Save $199.00 (39%)
        </h2>
        <div style={{ textAlign: "left", padding: "10px 10px 0px 10px" }}>
          <i className="fa fa-star" style={{ color: "#FFB400" }} />
          <i className="fa fa-star" style={{ color: "#FFB400" }} />
          <i className="fa fa-star" style={{ color: "#FFB400" }} />
          <i className="fa fa-star" style={{ color: "#FFB400" }} />
          <i className="fa fa-star" style={{ color: "#FFB400" }} />
        </div>
        <h2
          style={{
            fontSize: 16,
            textAlign: "left",
            padding: "10px 10px 0px 10px",
            color: "#bbb",
            fontWeight: 500,
          }}
        >
          Free Shipping
        </h2>
        <h2
          style={{
            fontSize: 16,
            textAlign: "left",
            padding: "10px 10px 0px 10px",
            color: "#bbb",
            fontWeight: 500,
          }}
        >
          <img loading="lazy" src={busimg} style={{ height: 30 }} alt="prev" />{" "}
          48 Hours Dispatch
        </h2>
      </div>
    </>
  );
};

export default Home;
