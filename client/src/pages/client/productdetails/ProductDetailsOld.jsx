import React, { useEffect, useMemo, useRef, useState } from "react";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import ClientTestimonial from "../../../components/clienttestimonial/ClientTestimonial";
import Footer from "../../../components/footer/Footer";
import Carousel from "react-multi-carousel";
import sec4 from "../../../assets/Image/sec4.jpg";
import MainFooter from "../../../components/mainfooter/MainFooter";
import "./productdetails.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchProductsDetailsByUrl } from "../../../redux/slices/productSlice";
import { addTocart } from "../../../redux/slices/cartSlice";
import CartSidebar from "../../../components/cartSidebar/CartSidebar";
import { axiosInstance } from "../../../config";
import Preloader from "../../../components/preloader/Preloader";
// import ReactHtmlParser from "react-html-parser";
// import { FaTrash } from "react-icons/fa";
import { REACT_APP_URL } from "../../../config";

import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { toastError, toastSuceess } from "../../../utils/reactToastify";
import ProductPdfComponents from "../../../components/productpdfcomponents/ProductPdfComponents";
import ReactToPrint from "react-to-print";
import Modal from "../../../components/modal/Modal";
import ProductCustomizedProduct from "./customizedproduct/ProductCustomizedProduct";
// import CanvasCustomizedproduct from "./customizedproduct/CanvasCustomizedproduct";
// import ImageGenreateApi from "./customizedproduct/ImageGenreateApi";
// import ProductDetailsImageGenrate from "./customizedproduct/ProductDetailsImageGenrate";
import { getAttriutePrice } from "../../../utils/varientimge/getAttributePrice";

const ProductDetails = () => {
  const componentRef = useRef(null);
  const { loading, productdetails } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  const { productname } = useParams();

  const [quantity, setquantity] = useState(1);
  const [managecart, setmanagecart] = useState(false);
  const [productdata, setproductdata] = useState([]);
  const [reviewdata, setreviewdata] = useState([]);
  const [buyingType, setbuyingType] = useState(" ");

  const [customizedProductPrice, setcustomizedProductPrice] = useState(0);

  //Calculate Customized Product Same As Front

  const [customizedProductPriceSAF, setcustomizedProductPriceSAF] = useState(0);
  const [customizedProductPriceCB, setcustomizedProductPriceCB] = useState(0);
  const [customizedProductPriceIB, setcustomizedProductPriceIB] = useState(0);

  //Back Details
  const [getallbackdetails, setgetallbackdetails] = useState({});

  useEffect(() => {
    dispatch(fetchProductsDetailsByUrl(productname));
    window.scrollTo(0, 0);
  }, [dispatch, productname]);

  useEffect(() => {
    if (loading === "fulfilled" && productdetails) {
      getproductbyproducttag(productdetails.tags);
      getreview();
      window.scrollTo(0, 0);
    }
  }, [loading]);

  const getreview = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/review?Product=${productdetails._id}`
      );

      setreviewdata(data.data);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const getproductbyproducttag = async (producttags) => {
    try {
      const filteredtag = producttags.map((p) => p._id);
      const { data } = await axiosInstance.post(
        "/api/product/producttag/product",
        {
          tags: filteredtag,
        }
      );
      setproductdata(data.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
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

  //Varient Working

  const [varientset, setvarientset] = useState({});

  //Varient SameasFront
  const [varientsetSAF, setvarientsetSAF] = useState({});
  const [varientsetBC, setvarientsetBC] = useState({});
  const [varientsetIB, setvarientsetIB] = useState({});

  //Show Modal

  const [show, setshow] = useState(false);

  const handleClose = () => {
    setshow(false);
  };

  const [varientproductdetails, setvarientproductdetails] = useState({});

  //Set bAck productdetails
  const [varientproductdetailsSAF, setvarientproductdetailsSAF] = useState({});
  const [varientproductdetailsCB, setvarientproductdetailsCB] = useState({});
  const [varientproductdetailsIB, setvarientproductdetailsIB] = useState({});

  const handlequantity = (type) => {
    if (type === "dec") {
      quantity > 1 && setquantity(quantity - 1);
    } else {
      if (
        varientproductdetails &&
        varientproductdetails.ProductInStockQuantity
      ) {
        if (quantity >= varientproductdetails.ProductInStockQuantity) {
          return toastError(
            `Quantity can't be greater than ${varientproductdetails.ProductInStockQuantity}`
          );
        }
        setquantity(quantity + 1);
      } else {
        if (quantity >= productdetails.ProductInStockQuantity) {
          return toastError(
            `Quantity can't be greater than ${productdetails.ProductInStockQuantity}`
          );
        }
        setquantity(quantity + 1);
      }
    }
  };

  const handleAddTocart = (name, price, id, img, gst = 0) => {
    // toast("")

    if (productdetails.SellingType !== "Normal" && buyingType === " ") {
      // toast("Please Select Buying type");
      toast.error("Please Select Buying type", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      return;
    }

    let newobj = {};

    if (varientproductdetails) {
      newobj = { ...varientset };
    }

    if (productdetails?.CustomizedProduct) {
      newobj["price"] = price * quantity;
    } else if (buyingType !== "Installment" && varientproductdetails) {
      newobj["price"] = varientproductdetails.OriginalPrice * quantity;
    } else if (buyingType !== "Installment") {
      newobj["price"] = price * quantity;
    } else {
      newobj["price"] = productdetails.Installment[0].Amount * quantity;
    }

    const product = {
      name,
      quantity,
      id,
      img:
        varientproductdetails && varientproductdetails.images.length > 0
          ? varientproductdetails.images[0]
          : img,
      sellingType:
        buyingType === "Normal" || buyingType === " "
          ? "Normal"
          : "Installment",
      Installment: productdetails.Installment,
      maxquantity: varientproductdetails
        ? varientproductdetails.ProductInStockQuantity
        : productdetails.ProductInStockQuantity,
      gst,

      //Product details with category
      ...newobj,
    };

    dispatch(addTocart({ product: product }));

    setmanagecart(true);
  };

  const toggleCart = () => {
    setmanagecart(!managecart);
  };

  const TotalRating = reviewdata?.reduce((sum, a) => sum + Number(a.Rating), 0);

  let avgrating = 0;
  if (TotalRating !== 0) {
    avgrating = TotalRating / reviewdata?.length;
  }

  const getbackvarient = async (id) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/product/getproductvarientSameasFront/${id}`,
        {
          SameAsFront: "SameAsFront",
          IgnoreBack: "IgnoreBack",
          CoverBack: "CoverBack",
        }
      );

      if (data.success) {
        setgetallbackdetails(data.data);
      }
    } catch (error) {
      toastError(error.response.data.message);
    }
  };

  //Get all combination of Varient

  useEffect(() => {
    if (loading === "fulfilled") {
      if (productdetails?.CustomizedProduct) {
        getbackvarient(productdetails._id);
      }

      let newobj = {};

      const attributeItemGroup = productdetails?.attribute?.map((p) => {
        newobj[p.Name] = p.OptionsValue[0].Name;
      });

      setvarientset(newobj);

      setvarientproductdetails(
        findObjectFromArray(newobj, productdetails.varient)
      );

      //Set Product SmaeASBAck

      if (productdetails?.CustomizedProduct) {
        const SAFobj = {};

        productdetails.BackSAF.map((p) => {
          SAFobj[p.Name] = p.OptionsValue[0].Name;
        });

        setvarientsetSAF(SAFobj);

        setvarientproductdetailsSAF(
          SAFobj,
          getallbackdetails.allCombinationssaf
        );

        // Cover Back

        const BCobj = {};

        productdetails.BackCB.map((p) => {
          BCobj[p.Name] = p.OptionsValue[0].Name;
        });

        setvarientsetBC(BCobj);

        setvarientproductdetailsCB(SAFobj, getallbackdetails.allCombinationscb);

        //Ignore BAck

        const IBobj = {};

        productdetails.BackIB.map((p) => {
          IBobj[p.Name] = p.OptionsValue[0].Name;
        });

        setvarientsetBC(IBobj);

        setvarientproductdetailsIB(IBobj, getallbackdetails.allCombinationsib);
      }
    }
  }, [loading]);

  //CAll function after usestate value set
  const handleVarient = (attributeitemName, attributeItemGroup) => {
    setvarientset({
      ...varientset,
      [attributeitemName]: attributeItemGroup,
    });

    let newuseStateobject = varientset;
    newuseStateobject[attributeitemName] = attributeItemGroup;

    const result = findObjectFromArray(
      newuseStateobject,
      productdetails.varient
    );
    setvarientproductdetails(result);
  };

  //Call this function to set the  SAF
  const handleVarientSAF = (attributeitemName, attributeItemGroup) => {
    setvarientsetSAF({
      ...varientset,
      [attributeitemName]: attributeItemGroup,
    });

    let newuseStateobject = varientset;
    newuseStateobject[attributeitemName] = attributeItemGroup;

    const result = findObjectFromArray(
      newuseStateobject,
      productdetails.varient
    );
    setvarientproductdetailsSAF(result);
  };

  //Call this function to set the  BC
  const handleVarientBC = (attributeitemName, attributeItemGroup) => {
    setvarientsetBC({
      ...varientset,
      [attributeitemName]: attributeItemGroup,
    });

    let newuseStateobject = varientset;
    newuseStateobject[attributeitemName] = attributeItemGroup;

    const result = findObjectFromArray(
      newuseStateobject,
      productdetails.varient
    );
    setvarientproductdetailsCB(result);
  };

  //Call this function to set the  IB
  const handleVarientIB = (attributeitemName, attributeItemGroup) => {
    setvarientsetIB({
      ...varientset,
      [attributeitemName]: attributeItemGroup,
    });

    let newuseStateobject = varientset;
    newuseStateobject[attributeitemName] = attributeItemGroup;

    const result = findObjectFromArray(
      newuseStateobject,
      productdetails.varient
    );
    setvarientproductdetailsIB(result);
  };

  function findObjectFromArray(searchObj, arr) {
    // const result = [];
    for (let i = 0; i < arr.length; i++) {
      const currentObj = arr[i];
      let isMatch = true;

      for (const key of Object.keys(searchObj)) {
        if (searchObj[key] !== currentObj[key]) {
          isMatch = false;
          break;
        }
      }

      if (isMatch) {
        return currentObj;
      }
    }

    // return result;
  }

  // Calculate Price  of Customized Product

  useMemo(() => {
    if (productdetails?.CustomizedProduct) {
      let totalcustomizedprice =
        productdetails.FixedPrice +
        getAttriutePrice(
          productdetails.attribute,
          varientproductdetails,
          productdetails.attributePosition
        );

      setcustomizedProductPrice(totalcustomizedprice);
    }
  }, [varientproductdetails]);

  //CAlculate Same As FRont Price BAsed on Varient Change

  useMemo(() => {
    if (productdetails?.CustomizedProduct) {
      let totalcustomizedprice =
        productdetails.FixedPriceSAF +
        getAttriutePrice(
          productdetails.BackSAF,
          varientproductdetailsSAF,
          productdetails.BackSAFPAQ
        );

      setcustomizedProductPriceSAF(totalcustomizedprice);
    }
  }, [varientproductdetailsSAF]);

  //Calculate Product Price Based On Cover BAck
  useMemo(() => {
    if (productdetails?.CustomizedProduct) {
      let totalcustomizedprice =
        productdetails.FixedPriceCB +
        getAttriutePrice(
          productdetails.BackCB,
          varientproductdetailsCB,
          productdetails.BackCBPAQ
        );

      setcustomizedProductPriceCB(totalcustomizedprice);
    }
  }, [varientproductdetailsCB]);

  //Calculate Product Price Based On Ignore BAck
  useMemo(() => {
    if (productdetails?.CustomizedProduct) {
      let totalcustomizedprice =
        productdetails.FixedPriceIB +
        getAttriutePrice(
          productdetails.BackIB,
          varientproductdetailsIB,
          productdetails.BackIBPAQ
        );

      setcustomizedProductPriceIB(totalcustomizedprice);
    }
  }, [varientproductdetailsIB]);

  if (loading === "pending") {
    return <Preloader />;
  }

  return (
    <>
      {/* Quotation Show */}
      <Modal
        handleClose={handleClose}
        show={show}
        width="90%"
        height="500px"
      ></Modal>

      {/* Seo TItle Desc */}

      <Helmet>
        <meta charset="UTF-8" />
        <title>{productdetails?.ProductName}</title>
        {/* <link rel="canonical" href="http://mysite.com/example" /> */}
        <meta name="description" content={productdetails?.SeoMetaDesc} />
        <meta name="keywords" content={productdetails?.SeoProductTitle} />
        {/* <meta name="author" content="John Doe" /> */}
      </Helmet>

      <StickySidebar />
      <MainHeader />

      {/* Open Cart Sidebar */}
      {/* {managecart && <CartSidebar toggleCart={toggleCart} />} */}

      {/* url tracker */}
      <div className="row" style={{ padding: "20px 30px 0px 30px" }}>
        {/* <p style={{ color: "#324040" }}>
          Home&nbsp;/&nbsp;Sleeper Sofas &amp; Futons&nbsp;/&nbsp;SKU:
          JJ26293A2I
        </p> */}
      </div>

      {/* product details with image */}
      <div className="row" style={{ padding: "0px 0px 0px 13px" }}>
        <div
          className="col-lg-12 HideInDesktop mobilecarousel"
          style={{ backgroundColor: "#475B52", marginLeft: "-6px" }}
        >
          <div
            id="carouselExampleDark"
            className="carousel carousel-dark slide "
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {productdetails?.ProductImage?.map((p) => (
                <>
                  <MobileImageSection key={p} img={p} />
                </>
              ))}

              {/* <div className="carousel-item active" data-bs-interval={10000}>
                <img
                  src="assets/Image/sec6.jpg"
                  className="d-block w-100 mobilecarouselHeight"
                  alt="..."
                />
                <div
                  className="carousel-caption d-none mt-5"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex !important",
                    flexDirection: "column",
                    justifyContent: "center",
                    left: 0,
                    bottom: 0,
                    alignItems: "center",
                    color: "#fff",
                  }}
                ></div>
              </div> */}
              <div className="carousel-item">
                <img
                  src="assets/Image/sec8.jpg"
                  className="d-block w-100 mobilecarouselHeight"
                  alt="..."
                />
                <div
                  className="carousel-caption d-none mt-5"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex !important",
                    flexDirection: "column",
                    justifyContent: "center",
                    left: 0,
                    bottom: 0,
                    alignItems: "center",
                    color: "#fff",
                  }}
                ></div>
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleDark"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleDark"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>

        <div className="col-lg-8 HideInPhone">
          <div className="row" style={{ height: "100vh", overflowY: "scroll" }}>
            {/* <div className="col-6 Section2Style"> */}
            {/* <h1>{productdetails?.CustomizedProduct}</h1> */}

            {productdetails?.CustomizedProduct &&
              productdetails.attributePosition &&
              productdetails.attributePosition.length > 0 &&
              Object.keys(varientproductdetails).length > 0 && (
                <>
                  {/* Image Genration Through   */}

                  <ProductCustomizedProduct
                    varientproductdetails={varientproductdetails}
                    attribute={productdetails.attribute}
                    attributePosition={productdetails.attributePosition}
                  />

                  {/* Product with same as front */}

                  {productdetails.BackSAF &&
                    productdetails.BackSAF.length > 0 && (
                      <>
                        <ProductCustomizedProduct
                          varientproductdetails={varientproductdetailsSAF}
                          // attribute={getallbackdetails?.allCombinationssaf}
                          attribute={productdetails?.BackSAF}
                          attributePosition={productdetails?.BackSAFPAQ}
                        />
                      </>
                    )}

                  {/* Product with Cover Back */}

                  {productdetails.BackCB &&
                    productdetails.BackCB.length > 0 && (
                      <>
                        <ProductCustomizedProduct
                          varientproductdetails={varientproductdetailsCB}
                          // attribute={getallbackdetails?.allCombinationssaf}
                          attribute={productdetails?.BackCB}
                          attributePosition={productdetails?.BackCBPAQ}
                        />
                      </>
                    )}

                  {/* Product with Ignore BAck */}
                  {productdetails.BackIB &&
                    productdetails.BackIB.length > 0 && (
                      <>
                        <ProductCustomizedProduct
                          varientproductdetails={varientproductdetailsIB}
                          // attribute={getallbackdetails?.allCombinationssaf}
                          attribute={productdetails?.BackIB}
                          attributePosition={productdetails?.BackIBPAQ}
                        />
                      </>
                    )}

                  {/* Image Creation Through Sharp Library */}

                  {/* <ProductDetailsImageGenrate
                    varientproductdetails={varientproductdetails}
                    attribute={productdetails.attribute}
                    attributePosition={productdetails.attributePosition}
                  /> */}
                </>
              )}

            {/* VArient Avavilable Then Show image based on VArient */}
            {varientproductdetails &&
            Object.keys(varientproductdetails).length > 0 ? (
              varientproductdetails.images.map((p) => (
                <>
                  <ProductImageSection key={p} img={p} />
                </>
              ))
            ) : (
              <>
                {productdetails?.ProductImage?.map((p) => (
                  <>
                    <ProductImageSection key={p} img={p} />
                  </>
                ))}
              </>
            )}

            {/* Show Images of Product Details if varientdetails not true */}

            {varientproductdetails &&
              productdetails?.ProductImage?.map((p) => (
                <>
                  <ProductImageSection key={p} img={p} />
                </>
              ))}
          </div>
        </div>

        <div className="col-lg-4" style={{ padding: 20 }}>
          <h4 style={{ color: "#324040" }}>{productdetails?.ProductName}</h4>

          {/* Adding Product details */}

          <select className="form-select" aria-label="Default select example">
            <option value="1">Back Same As Front</option>
            <option value="2">Back Cover Back</option>
            <option value="3">Back Ignore </option>
          </select>

          {productdetails.BackSAF && productdetails.BackSAF.length > 0 && (
            <>
              <h1>SAF</h1>₹ {customizedProductPriceSAF}
            </>
          )}

          {productdetails.BackSAF &&
            productdetails.BackSAF.length > 0 &&
            productdetails.BackSAF.map((p) => {
              return (
                <>
                  <div>
                    <span className="m-3 ">
                      <br></br>
                      <b>{p.PrintName}</b> : <b>{varientset[p.Name]}</b>
                    </span>
                    <div className="row" style={{ marginTop: "15px" }}>
                      {/* <AttributeOptionValue
                        optionvalue={p.OptionsValue}
                        handleVarient={handleVarient}
                        Name={p.Name}
                        varientset={varientset}
                      /> */}

                      {p.OptionsValue.map((option) => (
                        <>
                          <div
                            className="image-area productDetailimage-area"
                            onClick={() =>
                              handleVarientSAF(p.Name, option.Name)
                            }
                          >
                            <img
                              src={`${REACT_APP_URL}/images/attribute/${option.Photo}`}
                              alt="Preview"
                              style={{
                                border:
                                  varientsetSAF[p.Name] === option.Name
                                    ? "2px solid green"
                                    : "2px dotted green",
                                padding: "4px",
                                width: "70px",
                                height: "70px",
                                objectFit: "cover",
                                position: "relative",
                              }}
                            />

                            {varientsetSAF[p.Name] === option.Name && (
                              <>
                                <img
                                  src="https://img5.su-cdn.com/common/2023/04/12/5a3e03447c196fbc9002d68cd0469137.png"
                                  alt="selected Icon"
                                  style={{
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    bottom: "0%",
                                    right: "18%",
                                  }}
                                />
                              </>
                            )}
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                </>
              );
            })}

          {productdetails.BackCB && productdetails.BackCB.length > 0 && (
            <>
              <h1>CB</h1>₹ {customizedProductPriceCB}
            </>
          )}

          {productdetails.BackCB &&
            productdetails.BackCB.length > 0 &&
            productdetails.BackCB.map((p) => {
              return (
                <>
                  <div>
                    <span className="m-3 ">
                      <br></br>
                      <b>{p.PrintName}</b> : <b>{varientsetBC[p.Name]}</b>
                    </span>
                    <div className="row" style={{ marginTop: "15px" }}>
                      {/* <AttributeOptionValue
                        optionvalue={p.OptionsValue}
                        handleVarient={handleVarient}
                        Name={p.Name}
                        varientset={varientset}
                      /> */}

                      {p.OptionsValue.map((option) => (
                        <>
                          <div
                            className="image-area productDetailimage-area"
                            onClick={() => handleVarientBC(p.Name, option.Name)}
                          >
                            <img
                              src={`${REACT_APP_URL}/images/attribute/${option.Photo}`}
                              alt="Preview"
                              style={{
                                border:
                                  varientsetBC[p.Name] === option.Name
                                    ? "2px solid green"
                                    : "2px dotted green",
                                padding: "4px",
                                width: "70px",
                                height: "70px",
                                objectFit: "cover",
                                position: "relative",
                              }}
                            />

                            {varientsetBC[p.Name] === option.Name && (
                              <>
                                <img
                                  src="https://img5.su-cdn.com/common/2023/04/12/5a3e03447c196fbc9002d68cd0469137.png"
                                  alt="selected Icon"
                                  style={{
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    bottom: "0%",
                                    right: "18%",
                                  }}
                                />
                              </>
                            )}
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                </>
              );
            })}

          {productdetails.BackIB && productdetails.BackIB.length > 0 && (
            <>
              <h1>IB</h1>₹{customizedProductPriceIB}
            </>
          )}

          {productdetails.BackIB &&
            productdetails.BackIB.map((p) => {
              return (
                <>
                  <div>
                    <span className="m-3 ">
                      <br></br>
                      <b>{p.PrintName}</b> : <b>{varientsetIB[p.Name]}</b>
                    </span>
                    <div className="row" style={{ marginTop: "15px" }}>
                      {p.OptionsValue.map((option) => (
                        <>
                          <div
                            className="image-area productDetailimage-area"
                            onClick={() => handleVarientIB(p.Name, option.Name)}
                          >
                            <img
                              src={`${REACT_APP_URL}/images/attribute/${option.Photo}`}
                              alt="Preview"
                              style={{
                                border:
                                  varientsetIB[p.Name] === option.Name
                                    ? "2px solid green"
                                    : "2px dotted green",
                                padding: "4px",
                                width: "70px",
                                height: "70px",
                                objectFit: "cover",
                                position: "relative",
                              }}
                            />

                            {varientsetIB[p.Name] === option.Name && (
                              <>
                                <img
                                  src="https://img5.su-cdn.com/common/2023/04/12/5a3e03447c196fbc9002d68cd0469137.png"
                                  alt="selected Icon"
                                  style={{
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    bottom: "0%",
                                    right: "18%",
                                  }}
                                />
                              </>
                            )}
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                </>
              );
            })}

          {/* Productdetails Attribute */}
          {productdetails?.attribute &&
            productdetails.attribute.map((p) => {
              return (
                <>
                  <div>
                    <span className="m-3 ">
                      <br></br>
                      <b>{p.PrintName}</b> : <b>{varientset[p.Name]}</b>
                    </span>
                    <div className="row" style={{ marginTop: "15px" }}>
                      <AttributeOptionValue
                        optionvalue={p.OptionsValue}
                        handleVarient={handleVarient}
                        Name={p.Name}
                        varientset={varientset}
                      />
                    </div>
                  </div>
                </>
              );
            })}
          {TotalRating !== 0 && (
            <>
              {[...new Array(5)].map((arr, index) => {
                return index < avgrating ? (
                  <i className="fa fa-star" style={{ color: "#FFB400" }}></i>
                ) : (
                  <i className="far fa-star"></i>
                );
              })}
            </>
          )}
          <br></br>
          <br></br>
          {productdetails?.CustomizedProduct && productdetails.FixedPrice ? (
            <>
              {/* Set Price Of Customized Product */}
              <h4 style={{ color: "#324040" }}>
                ₹{" "}
                {/* {productdetails.FixedPrice +
                  getAttriutePrice(
                    productdetails.attribute,
                    varientproductdetails,
                    productdetails.attributePosition
                  )} */}
                {customizedProductPrice}
              </h4>
            </>
          ) : (
            <>
              {varientproductdetails &&
              Object.keys(varientproductdetails).length > 0 ? (
                <>
                  <h4 style={{ color: "#324040" }}>
                    ₹ {varientproductdetails.OriginalPrice} &nbsp;&nbsp;{" "}
                  </h4>
                </>
              ) : (
                <>
                  <h4 style={{ color: "#324040" }}>
                    ₹ {productdetails.OriginalPrice} &nbsp;&nbsp;{" "}
                    <strike style={{ fontSize: 14, color: "#D03727" }}>
                      ₹ {productdetails.SalePrice}
                    </strike>{" "}
                  </h4>
                </>
              )}
            </>
          )}
          {varientproductdetails &&
            Object.keys(varientproductdetails).length === 0 && (
              <>
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
                  {Number(productdetails.SalePrice) -
                    Number(productdetails.OriginalPrice)}{" "}
                  (
                  {(
                    100 -
                    (Number(productdetails.OriginalPrice) /
                      Number(productdetails.SalePrice)) *
                      100
                  ).toFixed(2)}
                  %)
                </h2>
              </>
            )}
          {productdetails.SellingType === "Installment" && (
            <>
              <br></br>
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
                      {productdetails.Installment &&
                        productdetails.Installment.map((p, i) => (
                          <>
                            <p key={p._id}>
                              {i === 0 ? (
                                <>
                                  <i className="fa fa-check-square-o"></i>{" "}
                                  {p.Name} - ₹ {p.Amount}{" "}
                                </>
                              ) : (
                                <>
                                  <i className="fa fa-square-o"></i> {p.Name} -
                                  ₹ {p.Amount}
                                </>
                              )}
                            </p>
                          </>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* input box to change price */}
              <div className="row mt-2">
                <div className="col-md-8">
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    onChange={(e) => setbuyingType(e.target.value)}
                  >
                    <option selected>Choose Buying Type</option>
                    <option value="Normal">Normal</option>
                    <option value="Installment">Installment</option>
                  </select>
                </div>
              </div>
            </>
          )}
          <div className="row" style={{ marginTop: 20 }}>
            {/* Add To Cart Customized Product */}

            {productdetails.FixedPrice && productdetails?.CustomizedProduct ? (
              <>
                {
                  <>
                    <div className="col-lg-4 Section3Style">
                      <div className="input-group ProductDetailAddtocartStyle">
                        <span className="input-group-btn">
                          <button
                            type="button"
                            className="quantity-left-minus btn btn-default btn-number"
                            style={{ backgroundColor: "#475B52" }}
                            data-field=""
                            onClick={() => {
                              handlequantity("dec");
                            }}
                          >
                            <span
                              className="fa fa-minus"
                              style={{ color: "#fff" }}
                            />
                          </button>
                        </span>
                        &nbsp;
                        <input
                          style={{ textAlign: "center" }}
                          type="text"
                          id="quantity"
                          name="quantity"
                          className="form-control input-number"
                          value={quantity}
                          min={1}
                          max={100}
                        />
                        &nbsp;
                        <span className="input-group-btn">
                          <button
                            type="button"
                            className="quantity-right-plus btn btn-default btn-number"
                            style={{ backgroundColor: "#475B52" }}
                            data-field=""
                            onClick={() => {
                              handlequantity("");
                            }}
                          >
                            <span
                              className="fa fa-plus"
                              style={{ color: "#fff" }}
                            />
                          </button>
                        </span>
                      </div>
                    </div>
                    <div className="col-lg-8 Section3Style">
                      <button
                        type="button"
                        className="button"
                        onClick={() => {
                          handleAddTocart(
                            productdetails?.ProductName,
                            customizedProductPrice,
                            productdetails?._id,
                            productdetails?.ProductImage[0],
                            productdetails?.GSTIN
                          );
                        }}
                      >
                        Add To Cart
                      </button>
                    </div>
                  </>
                }

                {/* {varientproductdetails &&
                Number(varientproductdetails.ProductInStockQuantity) > 0 ? (
                  <>
                    <div className="col-lg-4 Section3Style">
                      <div className="input-group ProductDetailAddtocartStyle">
                        <span className="input-group-btn">
                          <button
                            type="button"
                            className="quantity-left-minus btn btn-default btn-number"
                            style={{ backgroundColor: "#475B52" }}
                            data-field=""
                            onClick={() => {
                              handlequantity("dec");
                            }}
                          >
                            <span
                              className="fa fa-minus"
                              style={{ color: "#fff" }}
                            />
                          </button>
                        </span>
                        &nbsp;
                        <input
                          style={{ textAlign: "center" }}
                          type="text"
                          id="quantity"
                          name="quantity"
                          className="form-control input-number"
                          value={quantity}
                          min={1}
                          max={100}
                        />
                        &nbsp;
                        <span className="input-group-btn">
                          <button
                            type="button"
                            className="quantity-right-plus btn btn-default btn-number"
                            style={{ backgroundColor: "#475B52" }}
                            data-field=""
                            onClick={() => {
                              handlequantity("");
                            }}
                          >
                            <span
                              className="fa fa-plus"
                              style={{ color: "#fff" }}
                            />
                          </button>
                        </span>
                      </div>
                    </div>
                    <div className="col-lg-8 Section3Style">
                      <button
                        type="button"
                        className="button"
                        onClick={() => {
                          handleAddTocart(
                            productdetails?.ProductName,
                            productdetails?.OriginalPrice,
                            productdetails?._id,
                            productdetails?.ProductImage[0],
                            productdetails?.GSTIN
                          );
                        }}
                      >
                        Add To Cart
                      </button>
                    </div>
                  </>
                ) : !varientproductdetails &&
                  productdetails.ProductInStockQuantity > 0 ? (
                  <>
                    <div className="col-lg-4 Section3Style">
                      <div className="input-group ProductDetailAddtocartStyle">
                        <span className="input-group-btn">
                          <button
                            type="button"
                            className="quantity-left-minus btn btn-default btn-number"
                            style={{ backgroundColor: "#475B52" }}
                            data-field=""
                            onClick={() => {
                              handlequantity("dec");
                            }}
                          >
                            <span
                              className="fa fa-minus"
                              style={{ color: "#fff" }}
                            />
                          </button>
                        </span>
                        &nbsp;
                        <input
                          style={{ textAlign: "center" }}
                          type="text"
                          id="quantity"
                          name="quantity"
                          className="form-control input-number"
                          value={quantity}
                          min={1}
                          max={100}
                        />
                        &nbsp;
                        <span className="input-group-btn">
                          <button
                            type="button"
                            className="quantity-right-plus btn btn-default btn-number"
                            style={{ backgroundColor: "#475B52" }}
                            data-field=""
                            onClick={() => {
                              handlequantity("");
                            }}
                          >
                            <span
                              className="fa fa-plus"
                              style={{ color: "#fff   " }}
                            />
                          </button>
                        </span>
                      </div>
                    </div>
                    <div className="col-lg-8 Section3Style">
                      <button
                        type="button"
                        className="button"
                        onClick={() => {
                          handleAddTocart(
                            productdetails?.ProductName,
                            productdetails?.OriginalPrice,
                            productdetails?._id,
                            productdetails?.ProductImage[0],
                            productdetails?.GSTIN
                          );
                        }}
                      >
                        Add To Cart
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h4
                      style={{ color: "red", textAlign: "center" }}
                      className="blink"
                    >
                      Out of Stock
                    </h4>
                  </>
                )} */}
              </>
            ) : (
              <>
                {/* Add to Cart Normal and Varient Product  */}
                {varientproductdetails &&
                Number(varientproductdetails.ProductInStockQuantity) > 0 ? (
                  <>
                    <div className="col-lg-4 Section3Style">
                      <div className="input-group ProductDetailAddtocartStyle">
                        <span className="input-group-btn">
                          <button
                            type="button"
                            className="quantity-left-minus btn btn-default btn-number"
                            style={{ backgroundColor: "#475B52" }}
                            data-field=""
                            onClick={() => {
                              handlequantity("dec");
                            }}
                          >
                            <span
                              className="fa fa-minus"
                              style={{ color: "#fff" }}
                            />
                          </button>
                        </span>
                        &nbsp;
                        <input
                          style={{ textAlign: "center" }}
                          type="text"
                          id="quantity"
                          name="quantity"
                          className="form-control input-number"
                          value={quantity}
                          min={1}
                          max={100}
                        />
                        &nbsp;
                        <span className="input-group-btn">
                          <button
                            type="button"
                            className="quantity-right-plus btn btn-default btn-number"
                            style={{ backgroundColor: "#475B52" }}
                            data-field=""
                            onClick={() => {
                              handlequantity("");
                            }}
                          >
                            <span
                              className="fa fa-plus"
                              style={{ color: "#fff" }}
                            />
                          </button>
                        </span>
                      </div>
                    </div>
                    <div className="col-lg-8 Section3Style">
                      <button
                        type="button"
                        className="button"
                        onClick={() => {
                          handleAddTocart(
                            productdetails?.ProductName,
                            productdetails?.OriginalPrice,
                            productdetails?._id,
                            productdetails?.ProductImage[0],
                            productdetails?.GSTIN
                          );
                        }}
                      >
                        Add To Cart
                      </button>
                    </div>
                  </>
                ) : !varientproductdetails &&
                  productdetails.ProductInStockQuantity > 0 ? (
                  <>
                    <div className="col-lg-4 Section3Style">
                      <div className="input-group ProductDetailAddtocartStyle">
                        <span className="input-group-btn">
                          <button
                            type="button"
                            className="quantity-left-minus btn btn-default btn-number"
                            style={{ backgroundColor: "#475B52" }}
                            data-field=""
                            onClick={() => {
                              handlequantity("dec");
                            }}
                          >
                            <span
                              className="fa fa-minus"
                              style={{ color: "#fff" }}
                            />
                          </button>
                        </span>
                        &nbsp;
                        <input
                          style={{ textAlign: "center" }}
                          type="text"
                          id="quantity"
                          name="quantity"
                          className="form-control input-number"
                          value={quantity}
                          min={1}
                          max={100}
                        />
                        &nbsp;
                        <span className="input-group-btn">
                          <button
                            type="button"
                            className="quantity-right-plus btn btn-default btn-number"
                            style={{ backgroundColor: "#475B52" }}
                            data-field=""
                            onClick={() => {
                              handlequantity("");
                            }}
                          >
                            <span
                              className="fa fa-plus"
                              style={{ color: "#fff   " }}
                            />
                          </button>
                        </span>
                      </div>
                    </div>
                    <div className="col-lg-8 Section3Style">
                      <button
                        type="button"
                        className="button"
                        onClick={() => {
                          handleAddTocart(
                            productdetails?.ProductName,
                            productdetails?.OriginalPrice,
                            productdetails?._id,
                            productdetails?.ProductImage[0],
                            productdetails?.GSTIN
                          );
                        }}
                      >
                        Add To Cart
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h4
                      style={{ color: "red", textAlign: "center" }}
                      className="blink"
                    >
                      Out of Stock
                    </h4>
                  </>
                )}
              </>
            )}
          </div>
          <br />
          {/* <div className="row">
            <button
              className="btn"
              style={{ backgroundColor: "#475B52", color: "#fff" }}
            >
              <ReactToPrint
                trigger={() => (
                  <button className="btn btn-primary">Print Quotation</button>
                )}
                content={() => componentRef.current}
              />
            </button>
          </div> */}
          {/* Quotation Creation */}
          <Modal
            handleClose={handleClose}
            show={show}
            width="90%"
            height="500px"
            // style={{overflowY:"scroll"}}
            overflow={"scroll"}
          >
            {productdetails && (
              <>
                <ProductPdfComponents
                  ref={componentRef}
                  productdetails={productdetails}
                  varientset={varientset}
                  varientproductdetails={varientproductdetails}
                  quantity={quantity}
                  handleClose={handleClose}
                  customizedProductPrice={customizedProductPrice}
                  //Pass Customized Product In React

                  customizedProduct={
                    varientproductdetails &&
                    productdetails?.attribute &&
                    productdetails.attributePosition &&
                    productdetails.attributePosition.length > 0 ? (
                      <>
                        <ProductCustomizedProduct
                          height="200px"
                          width="200px"
                          varientproductdetails={varientproductdetails}
                          attribute={productdetails.attribute}
                          attributePosition={productdetails.attributePosition}
                        />
                      </>
                    ) : (
                      false
                    )
                  }
                />
              </>
            )}
          </Modal>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              className="btn "
              style={{ backgroundColor: "#475B52", color: "#fff" }}
              onClick={() => setshow(true)}
            >
              preview Quotation
            </button>
          </div>
          <br />
          <div className="row">
            <div
              className="col-lg-6 Section5Style MobileFreeShipping"
              style={{ marginBottom: "20px" }}
            >
              <div
                className="col-4 Section4Style FreeShipping"
                style={{
                  backgroundImage:
                    "url(http://railingo1.marwariplus.com/assets/Image/PO1.png)",
                }}
              />
              <div className="Section6Style">
                <p style={{ fontSize: 14 }}>
                  Free Shipping <br /> On All Orders
                </p>
              </div>
            </div>
            <div
              className="col-lg-6 Section5Style MobileFreeShipping"
              style={{ marginBottom: "20px" }}
            >
              <div
                className="col-4 Section4Style FreeShipping"
                style={{
                  backgroundImage:
                    "url(http://railingo1.marwariplus.com/assets/Image/PO2.png)",
                }}
              />
              <div className="Section6Style">
                <p style={{ fontSize: 14 }}>
                  30 Day Return <br /> On All Orders
                </p>
              </div>
            </div>
            <div
              className="col-lg-6 Section5Style MobileFreeShipping"
              style={{ marginBottom: "20px" }}
            >
              <div
                className="col-4 Section4Style FreeShipping"
                style={{
                  backgroundImage:
                    "url(http://railingo1.marwariplus.com/assets/Image/PO3.png)",
                }}
              />
              <div className="Section6Style">
                <p style={{ fontSize: 14 }}>
                  Late Delivery <br /> On All Orders
                </p>
              </div>
            </div>
            <div
              className="col-lg-6 Section5Style MobileFreeShipping"
              style={{ marginBottom: "20px" }}
            >
              <div
                className="col-4 Section4Style FreeShipping"
                style={{
                  backgroundImage:
                    "url(http://railingo1.marwariplus.com/assets/Image/PO4.png)",
                }}
              />
              <div className="Section6Style">
                <p style={{ fontSize: 14 }}>
                  Damage Comp. <br /> On All Orders
                </p>
              </div>
            </div>
            <div className="col-lg-6 Section5Style MobileFreeShipping">
              <div
                className="col-4 Section4Style FreeShipping"
                style={{
                  backgroundImage:
                    "url(http://railingo1.marwariplus.com/assets/Image/PO2.png)",
                }}
              />
              <div className="Section6Style">
                <p style={{ fontSize: 14 }}>
                  Service <br /> On All Orders
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="row justify-content-around productoverviewstyle"
          style={{
            margin: "50px 0px 0px 0px",
            backgroundColor: "#fff",
            padding: "50px 0px 50px 40px",
          }}
        >
          <h4>Product Overview</h4>
          <br />
          <br />
          <div className="container">
            <div
              className="col-lg-3 POSectionStyle MobileFreeShipping"
              style={{ float: "left" }}
            >
              <div
                className="col-2 POSectionStyle1"
                style={{
                  backgroundImage:
                    "url(http://railingo1.marwariplus.com/assets/Image/PO1.png)",
                }}
              />
              <div
                className="col-10"
                style={{ float: "left", padding: "2px 12px 0px 12px" }}
              >
                <p style={{ fontSize: 14 }}>
                  Free Shipping <br /> On All Orders
                </p>
              </div>
            </div>
            <div
              className="col-lg-3 POSectionStyle MobileFreeShipping"
              style={{ float: "left" }}
            >
              <div
                className="col-2 POSectionStyle1"
                style={{
                  backgroundImage:
                    "url(http://railingo1.marwariplus.com/assets/Image/PO3.png)",
                }}
              />
              <div
                className="col-10"
                style={{ float: "left", padding: "2px 12px 0px 12px" }}
              >
                <p style={{ fontSize: 14 }}>
                  30 Day Return <br /> On All Orders
                </p>
              </div>
            </div>
            <div
              className="col-lg-3 POSectionStyle MobileFreeShipping"
              style={{ float: "left" }}
            >
              <div
                className="col-2 POSectionStyle1"
                style={{
                  backgroundImage:
                    "url(http://railingo1.marwariplus.com/assets/Image/PO4.png)",
                }}
              />
              <div
                className="col-10"
                style={{ float: "left", padding: "2px 12px 0px 12px" }}
              >
                <p style={{ fontSize: 14 }}>
                  Late Delivery <br /> On All Orders
                </p>
              </div>
            </div>
            <div
              className="col-lg-3 POSectionStyle MobileFreeShipping"
              style={{ float: "left" }}
            >
              <div
                className="col-2 POSectionStyle1"
                style={{
                  backgroundImage:
                    "url(http://railingo1.marwariplus.com/assets/Image/PO2.png)",
                }}
              />
              <div
                className="col-10"
                style={{ float: "left", padding: "2px 12px 0px 12px" }}
              >
                <p style={{ fontSize: 14 }}>
                  Damage Comp. <br /> On All Orders
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
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
                        style={{ textDecoration: "none", color: "#000" }}
                        data-toggle="collapse"
                        data-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                        style={{ color: "#fff", textDecoration: "none" }}
                      >
                        Description
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
                      {/* {ReactHtmlParser(productdetails?.ProductDescription)} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {reviewdata && reviewdata?.length !== 0 && (
          <ClientTestimonial reviewdata={reviewdata} />
        )}

        {/* TESTIMONIALS */}
        <section className="testimonials">
          <div className="container">
            <div className="text-center mx-auto" style={{ maxWidth: 500 }}>
              <h1 style={{ textAlign: "center", textTransform: "uppercase" }}>
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
                        <>
                          <ProductTestimonial key={p._id} item={p} />
                        </>
                      ))}
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END OF TESTIMONIALS */}
      </div>

      <MainFooter />
    </>
  );
};

const ProductTestimonial = ({ item }) => {
  const dispatch = useDispatch();

  const handleAddTocart = (name, price, id, img, gst = 0) => {
    const product = {
      name,
      quantity: 1,
      price: price,
      id,
      img,
      sellingType: "Normal",
      gst: gst,
    };

    dispatch(addTocart({ product: product }));

    toast(`${name}, Added to Cart !`);

    // setmanagecart(true);
  };

  return (
    <>
      <div className="item">
        <div className="shadow-effect ">
          <figure className="effect-zoe">
            <Link to={`/product/${item.Urlhandle}`}>
              <img
                className="img-responsive"
                //   src={sec4}
                src={`${REACT_APP_URL}/images/product/${item.ProductImage[0]}`}
                style={{ height: "40vh", width: "100%" }}
                alt=""
              />
            </Link>

            <figcaption
              className="SingleProductfigcaption"
              onClick={() => {
                handleAddTocart(
                  item.ProductName,
                  item.OriginalPrice,
                  item._id,
                  item.ProductImage[0],
                  item.gst
                );
              }}
              style={{ marginTop: "-60px" }}
            >
              <h2 style={{ fontSize: 16, color: "#fff" }}>Add to Cart </h2>
              <p className="icon-links">
                <a>
                  <i
                    className="fa-solid fa-cart-shopping"
                    style={{ color: "#fff" }}
                  />
                </a>
              </p>
            </figcaption>
          </figure>
          <div
            className="item-details"
            style={{
              backgroundColor: "#fff",
              padding: 20,
              marginTop: "-25px",
            }}
          >
            <Link to={`/product/${item.Urlhandle}`}>
              <p style={{ color: "#324040" }}>{item.ProductName}</p>
            </Link>
            <h6 style={{ color: "#324040" }}>
              ₹ {item.OriginalPrice}&nbsp;
              <strike style={{ color: "#fff" }}>₹ {item.SalePrice}</strike>
            </h6>
            <h6 style={{ color: "#324040" }}>
              {" "}
              Save ₹ {Number(item.SalePrice) - Number(item.OriginalPrice)} (
              {(
                100 -
                (Number(item.OriginalPrice) / Number(item.SalePrice)) * 100
              ).toFixed(2)}
              %)
            </h6>
            <p style={{ color: "#324040" }}>Free Shipping</p>
          </div>
        </div>
      </div>
    </>
  );
};

const ProductImageSection = ({ img }) => {
  return (
    <>
      <div
        className="col-lg-6"
        style={{
          backgroundImage: `url(${REACT_APP_URL}/images/product/${img})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          height: "50vh",
          margin: "10px",
          width: "47%",
        }}
      />
    </>
  );
};

const MobileImageSection = ({ img }) => {
  return (
    <>
      <div className="carousel-item active" data-bs-interval={10000}>
        <img
          src={`${REACT_APP_URL}/images/product/${img}`}
          className="d-block w-100 mobilecarouselHeight"
          alt="..."
        />
        <div
          className="carousel-caption d-none mt-5"
          style={{
            width: "100%",
            height: "100%",
            display: "flex !important",
            flexDirection: "column",
            justifyContent: "center",
            left: 0,
            bottom: 0,
            alignItems: "center",
            color: "#fff",
          }}
        ></div>
      </div>
    </>
  );
};

const AttributeOptionValue = ({
  optionvalue,
  handleVarient,
  Name,
  varientset,
}) => {
  const [show, setshow] = useState(false);

  const handleClose = () => {
    setshow(false);
  };

  return (
    <>
      <div>
        <button
          className="btn "
          style={{ backgroundColor: "#475B52", color: "#fff" }}
          onClick={() => setshow(true)}
        >
          change {Name}
        </button>

        <Modal
          handleClose={handleClose}
          show={show}
          width="80%"
          height="200px"
          overflow={"scroll"}
        >
          <div style={{ display: "flex", margin: "30px" }}>
            {optionvalue.map((option, i) => {
              return (
                <>
                  <div
                    className="image-area productDetailimage-area"
                    onClick={() => handleVarient(Name, option.Name)}
                  >
                    <img
                      src={`${REACT_APP_URL}/images/attribute/${option.Photo}`}
                      alt="Preview"
                      style={{
                        border:
                          varientset[Name] === option.Name
                            ? "2px solid green"
                            : "2px dotted green",
                        padding: "4px",
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        position: "relative",
                      }}
                      onClick={handleClose}
                    />

                    {varientset[Name] === option.Name && (
                      <>
                        <img
                          src="https://img5.su-cdn.com/common/2023/04/12/5a3e03447c196fbc9002d68cd0469137.png"
                          alt="selected Icon"
                          style={{
                            position: "absolute",
                            width: "20px",
                            height: "20px",
                            bottom: "0%",
                            right: "18%",
                          }}
                        />
                      </>
                    )}

                    <h6 className="text-center">₹ {option.AttributePrice}</h6>
                  </div>
                </>
              );
            })}
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ProductDetails;
