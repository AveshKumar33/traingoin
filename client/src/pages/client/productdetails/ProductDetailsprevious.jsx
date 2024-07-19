import React, { useEffect, useState } from "react";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import ClientTestimonial from "../../../components/clienttestimonial/ClientTestimonial";
import Footer from "../../../components/footer/Footer";
import Carousel from "react-multi-carousel";
import sec4 from "../../../assets/Image/sec4.jpg";
import MainFooter from "../../../components/mainfooter/MainFooter";
import "./productdetails.css";
import { useDispatch, useSelector } from "react-redux";
import { REACT_APP_URL } from "../../../config";

import { Link, useParams } from "react-router-dom";
import { fetchProductsDetailsByUrl } from "../../../redux/slices/productSlice";
import { addTocart } from "../../../redux/slices/cartSlice";
import CartSidebar from "../../../components/cartSidebar/CartSidebar";
import { axiosInstance } from "../../../config";
import Preloader from "../../../components/preloader/Preloader";

const ProductDetails = () => {
  const { loading, productdetails } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  const { productname } = useParams();

  const [quantity, setquantity] = useState(1);
  const [managecart, setmanagecart] = useState(false);
  const [productdata, setproductdata] = useState([]);
  const [reviewdata, setreviewdata] = useState([]);

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

  const handlequantity = (type) => {
    if (type === "dec") {
      quantity > 1 && setquantity(quantity - 1);
    } else {
      setquantity(quantity + 1);
    }
  };

  const handleAddTocart = (name, price, id, img) => {
    const product = {
      name,
      quantity,
      price: price * quantity,
      id,
      img,
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

  if (loading === "pending") {
    return <Preloader />;
    return <h1>Loading..</h1>;
  }

  return (
    <>
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
      <div className="row" style={{ padding: "0px 0px 20px 20px" }}>
        <div
          className="col-lg-12 HideInDesktop mobilecarousel"
          style={{ backgroundColor: "#475B52", marginLeft: "-10px" }}
        >
          <div
            id="carouselExampleDark"
            className="carousel carousel-dark slide "
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active" data-bs-interval={10000}>
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
              </div>
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
          <div className="row">
            {/* <div className="col-6 Section2Style"> */}
            {productdetails?.ProductImage?.map((p) => (
              <>
                <ProductImageSection img={p} />
              </>
            ))}
            {/* </div> */}
          </div>
        </div>
        <div className="col-lg-4" style={{ padding: 20 }}>
          <h4 style={{ color: "#324040" }}>{productdetails?.ProductName}</h4>
          {TotalRating !== 0 && (
            <>
              {[...new Array(5)].map((arr, index) => {
                return index < avgrating ? (
                  <i class="fa fa-star" style={{ color: "#FFB400" }}></i>
                ) : (
                  <i class="far fa-star"></i>
                );
              })}
            </>
          )}

          {/* <i className="fa fa-star" style={{ color: "#FFB400" }} />
          <i className="fa fa-star" style={{ color: "#FFB400" }} />
          <i className="fa fa-star" style={{ color: "#FFB400" }} />
          <i className="fa fa-star" style={{ color: "#FFB400" }} />
          <i className="fa fa-star" style={{ color: "#FFB400" }} /> */}
          <br />
          <h4 style={{ color: "#324040" }}>
            ₹ {productdetails.OriginalPrice} &nbsp;&nbsp;{" "}
            <strike style={{ fontSize: 14 }}>
              ₹ {productdetails.SalePrice}
            </strike>
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
          <br />
          {/* <p>
            <b style={{ color: "#324040" }}>Options</b>
          </p>
          <div style={{ width: "100%", display: "flex" }}>
            <div className="col-lg-12 image-area" style={{ float: "left" }}>
              <img src="assets/Image/sec2.jpg" alt="Preview" />
              <a
                className="Select-image"
                href="#"
                style={{ display: "inline" }}
              >
                <i className="fa fa-check" />
              </a>
            </div>
            <div
              className="image-area"
              style={{ float: "left", marginLeft: 30 }}
            >
              <img src="assets/Image/sec2.jpg" alt="Preview" />
            </div>
          </div> */}
          <div className="row" style={{ marginTop: 40 }}>
            <div className="col-lg-4 Section3Style">
              <div className="input-group">
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
                    <span className="fa fa-minus" style={{ color: "#fff" }} />
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
                    <span className="fa fa-plus" style={{ color: "#fff" }} />
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
                    productdetails?.ProductImage[0]
                  );
                }}
              >
                Add To Cart
              </button>
            </div>
          </div>
          <br />
          <br />
          <div className="row">
            <div
              className="col-lg-6 Section5Style"
              style={{ marginBottom: "20px" }}
            >
              <div
                className="col-4 Section4Style"
                style={{
                  float: "left",
                  backgroundImage:
                    "url(http://railingo1.marwariplus.com/assets/Image/PO1.png)",
                  height: "50px",
                  backgroundPosition: "Center",
                  backgroundSize: "Cover",
                }}
              />
              <div className="Section6Style">
                <p style={{ fontSize: 14 }}>
                  Free Shipping <br /> On All Orders
                </p>
              </div>
            </div>
            <div
              className="col-lg-6 Section5Style"
              style={{ marginBottom: "20px" }}
            >
              <div
                className="col-4 Section4Style"
                style={{
                  float: "left",
                  backgroundImage:
                    "url(http://railingo1.marwariplus.com/assets/Image/PO2.png)",
                  height: "50px",
                  backgroundPosition: "Center",
                  backgroundSize: "Cover",
                }}
              />
              <div className="Section6Style">
                <p style={{ fontSize: 14 }}>
                  30 Day Return <br /> On All Orders
                </p>
              </div>
            </div>
            <div
              className="col-lg-6 Section5Style"
              style={{ marginBottom: "20px" }}
            >
              <div
                className="col-4 Section4Style"
                style={{
                  float: "left",
                  backgroundImage:
                    "url(http://railingo1.marwariplus.com/assets/Image/PO3.png)",
                  height: "50px",
                  backgroundPosition: "Center",
                  backgroundSize: "Cover",
                }}
              />
              <div className="Section6Style">
                <p style={{ fontSize: 14 }}>
                  Late Delivery <br /> On All Orders
                </p>
              </div>
            </div>
            <div
              className="col-lg-6 Section5Style"
              style={{ marginBottom: "20px" }}
            >
              <div
                className="col-4 Section4Style"
                style={{
                  float: "left",
                  backgroundImage:
                    "url(http://railingo1.marwariplus.com/assets/Image/PO4.png)",
                  height: "50px",
                  backgroundPosition: "Center",
                  backgroundSize: "Cover",
                }}
              />
              <div className="Section6Style">
                <p style={{ fontSize: 14 }}>
                  Damage Comp. <br /> On All Orders
                </p>
              </div>
            </div>
            <div className="col-lg-6 Section5Style">
              <div
                className="col-4 Section4Style"
                style={{
                  float: "left",
                  backgroundImage:
                    "url(http://railingo1.marwariplus.com/assets/Image/PO2.png)",
                  height: "50px",
                  backgroundPosition: "Center",
                  backgroundSize: "Cover",
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
          style={{ margin: "50px 0px 00px 0px" }}
        >
          <h4>Product Overview</h4>
          <br />
          <br />
          <div className="container">
            <div className="col-lg-3 POSectionStyle" style={{ float: "left" }}>
              <div
                className="col-2 POSectionStyle1"
                style={{
                  float: "left",
                  backgroundImage:
                    "url(http://railingo1.marwariplus.com/assets/Image/PO1.png)",
                  height: "50px",
                  backgroundPosition: "Center",
                  backgroundSize: "Cover",
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
            <div className="col-lg-3 POSectionStyle" style={{ float: "left" }}>
              <div
                className="col-2 POSectionStyle1"
                style={{
                  float: "left",
                  backgroundImage:
                    "url(http://railingo1.marwariplus.com/assets/Image/PO3.png)",
                  height: "50px",
                  backgroundPosition: "Center",
                  backgroundSize: "Cover",
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
            <div className="col-lg-3 POSectionStyle" style={{ float: "left" }}>
              <div
                className="col-2 POSectionStyle1"
                style={{
                  float: "left",
                  backgroundImage:
                    "url(http://railingo1.marwariplus.com/assets/Image/PO4.png)",
                  height: "50px",
                  backgroundPosition: "Center",
                  backgroundSize: "Cover",
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
            <div className="col-lg-3 POSectionStyle" style={{ float: "left" }}>
              <div
                className="col-2 POSectionStyle1"
                style={{
                  float: "left",
                  backgroundImage:
                    "url(http://railingo1.marwariplus.com/assets/Image/PO2.png)",
                  height: "50px",
                  backgroundPosition: "Center",
                  backgroundSize: "Cover",
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
                      Anim pariatur cliche reprehenderit, enim eiusmod high life
                      accusamus terry richardson ad squid. 3 wolf moon officia
                      aute, non cupidatat skateboard dolor brunch. Food truck
                      quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
                      tempor, sunt aliqua put a bird on it squid single-origin
                      coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                      helvetica, craft beer labore wes anderson cred nesciunt
                      sapiente ea proident. Ad vegan excepteur butcher vice
                      lomo. Leggings occaecat craft beer farm-to-table, raw
                      denim aesthetic synth nesciunt you probably haven't heard
                      of them accusamus labore sustainable VHS.
                    </div>
                  </div>
                </div>
                <div className="card" style={{ backgroundColor: "#475B52" }}>
                  <div className="card-header" id="headingTwo">
                    <h5 className="mb-0">
                      <button
                        className="btn btn-link collapsed"
                        style={{ textDecoration: "none", color: "#000" }}
                        data-toggle="collapse"
                        data-target="#collapseTwo"
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                      >
                        Weight &amp; Dimensions
                      </button>
                    </h5>
                  </div>
                  <div
                    id="collapseTwo"
                    className="collapse"
                    aria-labelledby="headingTwo"
                    data-parent="#accordion"
                  >
                    <div className="card-body">
                      Anim pariatur cliche reprehenderit, enim eiusmod high life
                      accusamus terry richardson ad squid. 3 wolf moon officia
                      aute, non cupidatat skateboard dolor brunch. Food truck
                      quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
                      tempor, sunt aliqua put a bird on it squid single-origin
                      coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                      helvetica, craft beer labore wes anderson cred nesciunt
                      sapiente ea proident. Ad vegan excepteur butcher vice
                      lomo. Leggings occaecat craft beer farm-to-table, raw
                      denim aesthetic synth nesciunt you probably haven't heard
                      of them accusamus labore sustainable VHS.
                    </div>
                  </div>
                </div>
                <div className="card" style={{ backgroundColor: "#475B52" }}>
                  <div className="card-header" id="headingThree">
                    <h5 className="mb-0">
                      <button
                        className="btn btn-link collapsed"
                        style={{ textDecoration: "none", color: "#000" }}
                        data-toggle="collapse"
                        data-target="#collapseThree"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                      >
                        Specifications
                      </button>
                    </h5>
                  </div>
                  <div
                    id="collapseThree"
                    className="collapse"
                    aria-labelledby="headingThree"
                    data-parent="#accordion"
                  >
                    <div className="card-body">
                      Anim pariatur cliche reprehenderit, enim eiusmod high life
                      accusamus terry richardson ad squid. 3 wolf moon officia
                      aute, non cupidatat skateboard dolor brunch. Food truck
                      quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
                      tempor, sunt aliqua put a bird on it squid single-origin
                      coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                      helvetica, craft beer labore wes anderson cred nesciunt
                      sapiente ea proident. Ad vegan excepteur butcher vice
                      lomo. Leggings occaecat craft beer farm-to-table, raw
                      denim aesthetic synth nesciunt you probably haven't heard
                      of them accusamus labore sustainable VHS.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TESTIMONIALS */}
        {reviewdata && reviewdata.length !== 0 && (
          <ClientTestimonial reviewdata={reviewdata} />
        )}

        {/* END OF TESTIMONIALS */}
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
                    {/* <ProductTestimonial />
                    <ProductTestimonial />
                    <ProductTestimonial />
                    <ProductTestimonial />
                    <ProductTestimonial /> */}
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

  const handleAddTocart = (name, price, id, img) => {
    const product = {
      name,
      quantity: 1,
      price: price,
      id,
      img,
    };

    dispatch(addTocart({ product: product }));

    // setmanagecart(true);
  };

  return (
    <>
      <div className="item">
        <div className="shadow-effect ">
          <figure className="effect-zoe">
            <img
              className="img-responsive"
              //   src={sec4}
              src={`${REACT_APP_URL}/images/product/${item.ProductImage[0]}`}
              style={{ height: "40vh", width: "100%" }}
              alt=""
            />
            <figcaption
              onClick={() => {
                handleAddTocart(
                  item.ProductName,
                  item.OriginalPrice,
                  item._id,
                  item.ProductImage[0]
                );
              }}
              style={{ marginTop: "-60px" }}
            >
              <h2 style={{ fontSize: 16 }}>Add to Cart </h2>
              <p className="icon-links">
                <a>
                  <i className="fa-solid fa-cart-shopping" />
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
            {/* <i className="fa fa-star" style={{ color: "#FFB400" }} />
            <i className="fa fa-star" style={{ color: "#FFB400" }} />
            <i className="fa fa-star" style={{ color: "#FFB400" }} />
            <i className="fa fa-star" style={{ color: "#FFB400" }} />
            <i className="fa fa-star" style={{ color: "#FFB400" }} /> */}
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

export default ProductDetails;
