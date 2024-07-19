import React, { useCallback, useEffect, useRef, useState } from "react";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import BackgroundVideo from "../../../assets/Image/BackgroundVideo.mp4";
import HeaderImage from "../../../assets/Image/Slider11.jpg";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { axiosInstance, REACT_APP_URL } from "../../../config";
import { Link, useParams } from "react-router-dom";
import "./SingleBlog.css";
import { toastError } from "../../../utils/reactToastify";
import FeelFreeToContactUs from "../home/FeelFreeToContactUs";

const SingleBlog = () => {
  const { id } = useParams();
  const [blog, setblog] = useState({});
  const [page, setpages] = useState(1);
  const [loading, setloading] = useState(false);
  const [rootCollection, setRootCollection] = useState([]);
  const scorllToRef = useRef();
  const [contactUs, setContactUs] = useState({});
  const [headerImage, setHeaderImage] = useState({});
  console.log("Loading ", headerImage, "...");
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/SingleBlog`
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
  const getblog = async () => {
    try {
      setloading(true);
      const { data } = await axiosInstance.get(`/api/blog/${id}`);
      setblog(data.blog);
      setloading(false);
    } catch (error) {
      setloading(false);
      console.log("error", error.response.data.message);
    }
  };
  /**fetch contactUsImage && contactUsVideo */
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
  }, [id]);

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
    getblog();
  }, [id]);

  const setselecedpage = (page) => {
    if (page < 1 || page > Math.ceil(blog.length / 10)) {
      return;
    }
    setpages(page);
    scorllToRef.current.scrollIntoView();
  };
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
      ></div>

      <div className="row" style={{ padding: "20px" }}>
        <div className="col-lg-5" style={{ float: "left" }}>
          <img
            src={`${REACT_APP_URL}/images/blog/${blog?.FeaturedImage}`}
            style={{
              width: "100%",
              borderRadius: "10px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
            }}
          ></img>
        </div>
        <div className="col-lg-7 SingleBlogContentStyle">
          <h4 className="SingleBlogContentStyle1">{blog?.heading}</h4>
          <span
            style={{
              textAlign: "justify !important",
              fontSize: "13.7px",
              fontWeight: "100",
              textTransform: "capitalize",
            }}
            dangerouslySetInnerHTML={{
              __html: blog?.content,
            }}
            className="productdescription"
          />{" "}
        </div>
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
                  <p className="exploreallproductstyleheading exploreallproductstyleheadingColor12">
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

export default SingleBlog;
